<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;


class LogoutController extends Controller
{
    /*
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        // Revoke the token of the currently authenticated user
        $request->user()->currentAccessToken()->delete();
        return $this->ResSuccess([
            'message' => 'Logged out successfully.'
        ], 200);
    }
}
