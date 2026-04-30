<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AccountController extends Controller
{
    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name'          => 'string|max:255',
            'password'      => 'nullable|string|min:8|confirmed',
            'avatar'        => 'nullable|file|max:2048',
            'verified'      => 'boolean',
            'product_codes' => 'nullable|array',
        ]);

        // Hash password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store new avatar
            $path = $request->file('avatar')->store('avatars', 'public');
            $validated['avatar'] = $path;
        }

        // Update user record
        $user->update($validated);

        return $this->ResSuccess([
            'message' => 'Account updated successfully.',
            'data'    => $user,
        ]);
    }
}