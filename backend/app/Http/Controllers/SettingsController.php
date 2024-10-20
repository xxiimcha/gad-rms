<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\SettingsResource;
use App\Models\Settings;

class SettingsController extends Controller
{
    public function settings(Request $request)
    {
        $settings = Settings::all();
        
        return SettingsResource::collection($settings);
    }

    public function store(Request $request)  {
        return new SettingsResource(Settings::create($request->all()));
    }

    public function update(Request $request)
    {
        $settings = Settings::findOrFail($request->id);

        $updates = [];

        if ($request->has('deadline') && $request->deadline !== $settings->deadline) {
            $updates['deadline'] = $request->deadline;
        }

        // If there are updates, proceed with updating the user
        if (!empty($updates)) {
            $settings->update($updates);
        }

        return new SettingsResource($settings);
    }

    public function destroy(Request $request)
    {
        $settings = Settings::findOrFail($request->id);
        return $settings->delete();
    }
}
