<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\SettingsResource;
use App\Http\Resources\NotificationResource;
use App\Models\Settings;
use App\Models\Notification;
use App\Models\Barangay;

class SettingsController extends Controller
{
    public function settings(Request $request)
    {
        $settings = Settings::all();
        return SettingsResource::collection($settings);
    }

    public function store(Request $request)
    {
        // Create new setting
        $settings = Settings::create($request->all());

        // Create notification for the new setting
        $this->createNotification($request->barangay, 'New setting created');

        return new SettingsResource($settings);
    }

    public function update(Request $request)
    {
        $settings = Settings::findOrFail($request->id);

        $updates = [];

        if ($request->has('deadline') && $request->deadline !== $settings->deadline) {
            $updates['deadline'] = $request->deadline;
        }

        // If there are updates, proceed with updating the setting
        if (!empty($updates)) {
            $settings->update($updates);

            // Create notification with the actual deadline date
            $this->createNotification($settings->barangay, 'VAW and VAC case report must be submitted on or before', $updates['deadline']);
        }

        return new SettingsResource($settings);
    }


    public function destroy(Request $request)
    {
        $settings = Settings::findOrFail($request->id);

        // Create notification for the deletion
        $this->createNotification($settings->barangay, 'Setting deleted');

        // Delete the setting
        $settings->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }

    /**
     * Create a notification entry.
     *
     * @param string $barangay_name
     * @param string $message
     * @param string|null $deadline_date
     * @return void
     */
    protected function createNotification($barangay_name, $message, $deadline_date = null)
    {
        Notification::create([
            'barangay' => $barangay_name,
            'message' => $message,
            'deadline_date' => $deadline_date,
            'is_read' => false,
        ]);
    }

}
