<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CityResource;
use App\Models\City;

class CityController extends Controller
{
    public function cities(Request $request)
    {
        $cities = City::all();
        
        return CityResource::collection($cities);
    }
}
