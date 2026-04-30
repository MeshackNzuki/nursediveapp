<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\verifyUserEmail;

class EmailVerificationController extends Controller
{
    // Send verification token
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        // generate token
        $token = rand(100000, 999999); // 6-digit numeric
        $user->verification_token = $token;
        $user->save();

        $query = 'verification_email' . '=' . $user->email . '&token=' . $token;

        $user->notify(new VerifyUserEmail($query));

        return $this->ResSuccess(['message' => 'Verification code sent.']);
    }

    // Verify token
    public function verifyEmailConfirm(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
            ->where('verification_token', $request->token)
            ->first();

        if (!$user) {
            return $this->ResError(['message' => 'Invalid token'], 400);
        }

        $user->email_verified_at = now();
        $user->verification_token = null;
        $user->save();

        return $this->ResSuccess(['message' => 'success']);
    }
}
