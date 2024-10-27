<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\Barangay;

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
}
