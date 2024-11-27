<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use App\Mail\OTP;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Barangay;
use App\Models\ViolenceAgainstChildren;
use App\Models\ViolenceAgainstWomen;

class UserController extends Controller
{
    public function users(Request $request)
    {
        $currentUser = $request->user();

        $users = User::where('id', '!=', $currentUser->id)->get();
        foreach($users as $user) {
            $brgy = Barangay::findOrFail($user['barangay']);
            $user['barangay'] = $brgy ? $brgy->name : '' ;
        }

        return UserResource::collection($users);
    }

    public function get_user(Request $request, $id)
    {
        return new UserResource(User::findOrFail($id) ?? null);
    }

    public function store(Request $request)  {
        $request['password'] = Hash::make($request['password']);
        return new UserResource(User::create($request->all()));
    }

    public function update(Request $request)
    {
        $user = User::findOrFail($request->id);

        $updates = [];

        if ($request->has('email') && $request->email !== $user->email) {
            $updates['email'] = $request->email;
        }

        if ($request->has('first_name') && $request->first_name !== $user->first_name) {
            $updates['first_name'] = $request->first_name;
        }

        if ($request->has('last_name') && $request->last_name !== $user->last_name) {
            $updates['last_name'] = $request->last_name;
        }

        if ($request->has('position') && $request->position !== $user->position) {
            $updates['position'] = $request->position;
        }

        if ($request->has('contact_number') && $request->contact_number !== $user->contact_number) {
            $updates['contact_number'] = $request->contact_number;
        }

        if ($request->has('city') && $request->city !== $user->city) {
            $updates['city'] = $request->city;
        }

        if ($request->has('barangay') && $request->barangay !== $user->barangay) {
            $updates['barangay'] = $request->barangay;
        }

        if ($request->has('address_line_1') && $request->address_line_1 !== $user->address_line_1) {
            $updates['address_line_1'] = $request->address_line_1;
        }

        // Hash and update password if provided and modified
        if ($request->has('password')) {
            $newPassword = $request->password;
            if ($newPassword !== $user->password) {
                $updates['password'] = Hash::make($newPassword);
            }
        }

        // Check if role is modified
        if ($request->has('role') && $request->role !== $user->role) {
            $updates['role'] = $request->role;
        }

        // If there are updates, proceed with updating the user
        if (!empty($updates)) {
            $user->update($updates);
        }

        return new UserResource($user);
    }

    public function destroy(Request $request)
    {
        $user = User::findOrFail($request->id);
        return $user->delete();
    }

    public function notifications(Request $request) {
        $currentUser = $request->user();
        $notificationData = [];

        if ($currentUser->role === 'super admin') {
            $vaw = \DB::table('violence_against_women')
                ->leftJoin('barangays', 'barangays.id', '=', 'violence_against_women.barangay')
                ->select(
                    'violence_against_women.id as id',
                    'violence_against_women.month',
                    'violence_against_women.status',
                    'barangays.name as barangay',
                    \DB::raw("'VAW' as type")
                )
                ->where('violence_against_women.status', '=', 'Submitted')
                ->whereNull('violence_against_women.deleted_at');

            $vac = \DB::table('violence_against_children')
                ->leftJoin('barangays', 'barangays.id', '=', 'violence_against_children.barangay')
                ->select(
                    'violence_against_children.id as id',
                    'violence_against_children.month',
                    'violence_against_children.status',
                    'barangays.name as barangay',
                    \DB::raw("'VAC' as type")
                )
                ->where('violence_against_children.status', '=', 'Submitted')
                ->whereNull('violence_against_children.deleted_at');

            // Combine the results
            $notificationData = $vaw->union($vac)->get();
        } else {
            $vaw = \DB::table('violence_against_women')
                ->leftJoin('barangays', 'barangays.id', '=', 'violence_against_women.barangay')
                ->select(
                    'violence_against_women.id as id',
                    'violence_against_women.month',
                    'violence_against_women.status',
                    'barangays.name as barangay',
                    \DB::raw("'VAW' as type")
                )
                ->where('violence_against_women.status', '=', 'Received')
                ->whereNull('violence_against_women.deleted_at');

            $vac = \DB::table('violence_against_children')
                ->leftJoin('barangays', 'barangays.id', '=', 'violence_against_children.barangay')
                ->select(
                    'violence_against_children.id as id',
                    'violence_against_children.month',
                    'violence_against_children.status',
                    'barangays.name as barangay',
                    \DB::raw("'VAC' as type")
                )
                ->where('violence_against_children.status', '=', 'Received')
                ->whereNull('violence_against_children.deleted_at');

            // Combine the results
            $notificationData = $vaw->union($vac)->get();

            $deadline = now()->addDays(3);
            $additionalNotifications = \DB::table('settings')
                ->where('deadline', '<=', $deadline)
                ->where('email', $currentUser->email)
                ->whereNull('deleted_at')
                ->get(['id', 'email', 'barangay', 'deadline', 'created_at', 'updated_at']);

            $notificationData = $notificationData->merge($additionalNotifications);
        }

        return response()->json($notificationData);
    }


    public function sendSmsViaSemaphore($phoneNumber, $message)
    {
        $apiKey = env('SEMAPHORE_API_KEY'); // Your API key
        $senderName = env('SEMAPHORE_SENDER_NAME', 'SEMAPHORE'); // Default sender name

        $ch = curl_init();

        $parameters = [
            'apikey' => $apiKey,
            'number' => $phoneNumber,
            'message' => $message,
            'sendername' => $senderName,
        ];

        curl_setopt($ch, CURLOPT_URL, 'https://semaphore.co/api/v4/messages');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($parameters));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification

        $output = curl_exec($ch);

        if (curl_errno($ch)) {
            \Log::error('Semaphore cURL Error: ' . curl_error($ch));
            curl_close($ch);
            return [
                'success' => false,
                'message' => 'Failed to send SMS.',
                'error' => curl_error($ch),
            ];
        }

        curl_close($ch);

        return json_decode($output, true); // Return decoded JSON response
    }


    public function email_generated_session_otp(Request $request)
    {
        $user = Auth::user();
        $otp = rand(100000, 999999); // Generate a 6-digit OTP
        $otp_expires_at = \Carbon\Carbon::now()->addMinutes(5); // OTP expiration time

        // Save OTP and expiration time in the user's record
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => $otp_expires_at,
        ]);

        $deliveryMethod = $request->input('deliveryMethod', 'email'); // Default to email

        if ($deliveryMethod === 'SMS') {
            // Send OTP via SMS using Semaphore
            $message = "Your OTP code is: $otp. Please use this code to log in to your account. The code is valid for 5 minutes only. Do not share this code with anyone. If you did not request this code, please ignore this message.";
            $smsResponse = $this->sendSmsViaSemaphore($user->contact_number, $message);

            // Check if response indicates success
            if ($smsResponse['success'] || isset($smsResponse['response']['status']) && $smsResponse['response']['status'] === 'pending') {
                return response()->json([
                    'data' => true,
                    'contact_number' => $user->contact_number,
                    'message' => 'OTP sent via SMS',
                    'message_sent_to' => $user->contact_number,
                    'otp_expires_at' => $otp_expires_at->toDateTimeString(),
                ]);
            } else {
                return response()->json([
                    'data' => false,
                    'message' => $smsResponse['message'] ?? 'Failed to send OTP via SMS.',
                    'error' => $smsResponse['error'] ?? null,
                ], 500);
            }
        } else {
            // Default to email delivery
            Mail::to($user->email)->send(new OTP($otp));

            return response()->json([
                'data' => true,
                'email' => $user->email,
                'message' => 'OTP sent via email',
                'message_sent_to' => $user->email,
                'otp_expires_at' => $otp_expires_at->toDateTimeString(),
            ]);
        }
    }

}
