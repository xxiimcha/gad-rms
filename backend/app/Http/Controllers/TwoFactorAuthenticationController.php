<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TwoFactorAuthenticationController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required|string',
        ]);

        $user = Auth::user();
        $otp = $user->otp;
        $otpExpiresAt = $user->otp_expires_at;

        if ($otp && $otpExpiresAt && \Carbon\Carbon::now()->lessThanOrEqualTo($otpExpiresAt) && $request->otp === $otp) {
            $user->update([
                'otp' => null,
                'otp_expires_at' => null,
                'two_factor' => now(),
                'two_factor_expires_at' => now()->addHours(1),
            ]);

            return response()->json([
                'message' => 'OTP verified successfully',
                'data' => true,
            ]);
        }

        return response()->json(['message' => 'Invalid or expired OTP'], 401);
    }
}
