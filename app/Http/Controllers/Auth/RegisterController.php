<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserSubscription;
use App\Models\Plan;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole('student');

        $user->notify(new \App\Notifications\WelcomeUser());

        $trialPlans = Plan::where('name', 'trial')->get()->keyBy('product_code');

        $subscriptions = [];

        foreach (['teas', 'nclex', 'nursing'] as $product) {
            $plan = $trialPlans->get($product);
            if ($plan) {
                $subscriptions[$product] = [[
                    'plan_id'      => $plan->id,
                    'plan_name'    => $plan->name,
                    'product_code' => $product,
                    'expires' => now()->addDays((int) $plan->duration_days)->toDateString(),
                    'payment_id'   => null,
                ]];
            }
        }

        UserSubscription::create([
            'user_id'       => $user->id,
            'subscriptions' => json_encode($subscriptions),
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return $this->ResSuccess([
            'token' => $token,
            'roles' => $user->getRoleNames(),
            'name'  => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'email_verified_at' => $user->email_verified_at,
            'subscriptions' => $subscriptions,
        ]);
    }
}
