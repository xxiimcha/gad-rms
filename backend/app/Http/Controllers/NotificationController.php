<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use App\Http\Resources\NotificationResource;
use App\Models\Barangay;
use App\Models\User;

class NotificationController extends Controller
{
    public function createNotification(Request $request)
    {
        $barangay = Barangay::find($request->barangay_id);

        if ($barangay) {
            $notification = Notification::create([
                'barangay' => $barangay->name,  // Store the name of the barangay
                'message' => 'This is a notification message',
                'deadline_date' => $request->deadline_date,
                'is_read' => false,
            ]);

            return response()->json(['notification' => $notification], 201);
        } else {
            return response()->json(['error' => 'Barangay not found'], 404);
        }
    }

    public function getNotificationsByBarangay()
{
    try {
        // Get the logged-in user with the barangayRelation relationship
        $user = Auth::user()->load('barangayRelation'); // Eager load the barangay relationship
        \Log::info('User Retrieved with Barangay:', ['user' => $user]);

        // Check if the barangay relationship is loaded correctly
        if (!$user->barangayRelation) {
            \Log::error('User has no assigned barangay');
            return response()->json(['error' => 'User has no assigned barangay'], 404);
        }

        // Fetch barangay name
        $barangayName = $user->barangayRelation->name;  // Accessing the 'name' property on the related barangay
        \Log::info('Barangay Name Retrieved:', ['barangayName' => $barangayName]);

        // Fetch notifications based on barangay name
        $notifications = Notification::where('barangay', $barangayName)->get();

        return NotificationResource::collection($notifications);
    } catch (\Exception $e) {
        \Log::error('Error fetching notifications by barangay: ' . $e->getMessage());
        return response()->json(['error' => 'Failed to fetch notifications'], 500);
    }
}

}
