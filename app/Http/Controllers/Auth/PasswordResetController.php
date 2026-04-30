<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Notifications\CustomResetPassword;
use App\Notifications\verifyUserEmail;
use App\Http\Controllers\Controller;

class PasswordResetController extends Controller
{
    // Step 1: Request reset
    public function requestReset(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $existing = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if ($existing && $existing->created_at && now()->diffInSeconds($existing->created_at) < 60) {
            // Reuse the existing token
            $token = $existing->token;
        } else {
            // Generate a new token
            $token = Str::random(5); // use longer token for better security
            DB::table('password_resets')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => $token,
                    'created_at' => now(),
                ]
            );
        }

        $user = User::where('email', $request->email)->first();

        $query = 'reset_email' . '=' . $user->email . '&token=' . $token;

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

        $record = DB::table('password_resets')
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
        if (now()->diffInMinutes($record->created_at) > 60) {
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

        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid token'], 400);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Token expired'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password)]);

        // Delete reset record
        DB::table('password_resets')->where('email', $request->email)->delete();


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
            'subscriptions' => $user->subscriptions()
                ->with('plan')
                ->get()
                ->map(function ($sub) {
                    return [
                        'product_code' => $sub->product_code,
                        'status'       => $sub->status,
                        'expiry_date'  => optional($sub->expiry_date)->toDateString(),
                        'is_active'    => $sub->isActive(),
                        'plan'         => [
                            'id'    => $sub->plan?->id,
                            'name'  => $sub->plan?->name,
                            'price' => $sub->plan?->price,
                        ],
                    ];
                }),
        ]);
    }
}
