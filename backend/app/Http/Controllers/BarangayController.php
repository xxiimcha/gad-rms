<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\BarangayResource;
use App\Models\Barangay;

class BarangayController extends Controller
{
    public function barangays(Request $request)
    {
        $brgy = Barangay::all();
        
        return BarangayResource::collection($brgy);
    }

    public function get_barangay(Request $request, $id)
    {
        return new BarangayResource(Barangay::findOrFail($id) ?? null);
    }

    public function barangays_by_city(Request $request, $cityId)
    {
        // Retrieve barangays based on the provided city ID
        $barangays = Barangay::where('city_id', $cityId)->get();
        
        // Return the filtered barangays as a collection
        return BarangayResource::collection($barangays);
    }
}
