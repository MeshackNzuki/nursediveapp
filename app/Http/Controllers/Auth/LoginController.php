<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;

use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{

    /* * @param \Illuminate\Http\Request $request * @return \Illuminate\Http\Response */

    public function checkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email',]);
        $user = User::where('email', $request->email)->first();
        return $this->ResSuccess(['exists' => (bool) $user]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        //print('stopped');die();

        $user = User::where('email', $request->email)->with('subscription')->first();

        if ($user && Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $token = $user->createToken('authToken')->plainTextToken;


            return $this->ResSuccess([
                'token' => $token,
                'roles' => $user->getRoleNames(),
                'name'  => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'email_verified_at' => $user->email_verified_at,
                'subscriptions' => json_decode($user->subscription->subscriptions)


                // 'subscriptions' => optional($user->subscription->first(), function ($sub) {
                //     return is_string($sub->subscriptions)
                //         ? json_decode($sub->subscriptions, true)
                //         : $sub->subscriptions;
                // }),
            ]);
        }

        throw ValidationException::withMessages([
            'email' => ['Invalid credentials.'],
        ]);
    }
}
