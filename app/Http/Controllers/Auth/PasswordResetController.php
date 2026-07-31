<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Notifications\CustomResetPassword;
use App\Notifications\verifyUserEmail;
use App\Http\Controllers\Controller;

class PasswordResetController extends Controller
{
    private function resetTokenTable(): string
    {
        $broker = config('auth.defaults.passwords', 'users');

        return config("auth.passwords.{$broker}.table", 'password_reset_tokens');
    }

    private function resetTokenExpiresInMinutes(): int
    {
        $broker = config('auth.defaults.passwords', 'users');

        return (int) config("auth.passwords.{$broker}.expire", 60);
    }

    private function resetTokenThrottleInSeconds(): int
    {
        $broker = config('auth.defaults.passwords', 'users');

        return (int) config("auth.passwords.{$broker}.throttle", 60);
    }

    // Step 1: Request reset
    public function requestReset(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $resetTokenTable = $this->resetTokenTable();

        $existing = DB::table($resetTokenTable)
            ->where('email', $request->email)
            ->first();

        if ($existing && $existing->created_at && now()->diffInSeconds($existing->created_at) < $this->resetTokenThrottleInSeconds()) {
            // Reuse the existing token
            $token = $existing->token;
        } else {
            // Generate a new token
            $token = Str::random(64);
            DB::table($resetTokenTable)->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => $token,
                    'created_at' => now(),
                ]
            );
        }

        $user = User::where('email', $request->email)->first();

        $query = http_build_query([
            'reset_email' => $user->email,
            'token' => $token,
        ]);

        $user->notify(new CustomResetPassword($query));

        return $this->ResSuccess([
            'message' => 'We have emailed your password reset code!',
        ]);
    }

    public function resetConfirm(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
        ]);

        $record = DB::table($this->resetTokenTable())
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return $this->ResError('No reset request found for this email', 400);
        }

        // Check if token matches
        if ($record->token !== $request->token) {
            return $this->ResError('Invalid token', 400);
        }

        // Check if token expired (60 minutes)
        if (Carbon::parse($record->created_at)->addMinutes($this->resetTokenExpiresInMinutes())->isPast()) {
            return $this->ResError('Token expired', 400);
        }

        return $this->ResSuccess([
            'message' => 'success',
        ]);
    }

    // Step 3: Reset password
    public function reset(Request $request)
    {
        $request->validate([
            'email'    => 'required|email|exists:users,email',
            'token'    => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $record = DB::table($this->resetTokenTable())
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        if (Carbon::parse($record->created_at)->addMinutes($this->resetTokenExpiresInMinutes())->isPast()) {
            return response()->json(['message' => 'Token expired'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);

        Auth::login($user);

        // Delete reset record
        DB::table($this->resetTokenTable())->where('email', $request->email)->delete();


        // Issue token
        $token = $user->createToken('authToken')->plainTextToken;

        // Return with subscriptions
        return $this->ResSuccess([
            'token' => $token,
            'roles' => $user->getRoleNames(),
            'name'  => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'email_verified_at' => $user->email_verified_at,
            'subscriptions' => $user->subscription?->subscriptions,
        ]);
    }
}
