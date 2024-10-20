<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\AuditsResource;
use App\Models\Audits;

class AuditsController extends Controller
{
    public function audits(Request $request)
    {
        $currentUser = $request->user();

        if ($currentUser->role === 'super admin') {
            $audits = Audits::orderBy('created_at', 'desc')->get();
        } else {
            $audits = Audits::where('user_id', $currentUser->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return AuditsResource::collection($audits);
    }
}
