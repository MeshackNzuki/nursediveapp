<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UsersController extends Controller
{
    /**
     * Display a listing of the users.
     *
     */
    public function index(Request $request)
    {


        $users = User::with(['roles', 'permissions',])
            ->withMax(['tokens as last_login'], 'last_used_at')
            ->get();

        return $this->ResSuccess([
            'users' => $users,
            'message' => 'Users retrieved successfully'
        ], 201);
    }


    /**
     * Get all roles.
     *
     */

    public function getAllRoles()
    {

        $roles = \Spatie\Permission\Models\Role::all();

        return $this->ResSuccess([
            'roles' => $roles,
            'message' => 'Roles retrieved successfully'
        ], 201);
    }

    public function getAllPermissions()
    {
        $permissions = \Spatie\Permission\Models\Permission::all();
        return $this->ResSuccess([
            'permissions' => $permissions,
            'message' => 'Permissions retrieved successfully'
        ], 201);
    }

    /**
     * Store a newly created user with roles.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'details' => 'nullable|string',
                'email' => 'required|email|unique:users,email',
                'role' => 'required|string|exists:roles,name',
                'phone' => 'nullable|string|max:20',
                'staff_number' => 'nullable|string|max:20',
            ]);

            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'details' => $request->input('details'),
                'phone' => $request->input('phone'),
                'staff_number' => $request->input('staff_number'),
                'password' => bcrypt('default_password'), // Change to secure password
            ]);

            // Assign role using Spatie
            $user->assignRole($request->input('role'));

            return $this->ResSuccess([
                'user' => $user,
                'message' => 'User created successfully'
            ], 201);
        } catch (ValidationException $e) {
            return $this->ResError([
                'user' => null,
                'message' => 'Validation error',
                'errors' => $e->validator->errors()->all()
            ], 422);
        } catch (\Exception $e) {
            return $this->ResError([
                'user' => null,
                'message' => 'Failed to create user',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified user with roles.
     *
     * @param  int  $id
     */
    public function show($id)
    {
        $user = User::with('roles')->find($id);
        return $this->ResSuccess([
            'user' => $user,
            'message' => 'User retrieved successfullyy'
        ], 200);
    }

    /**
     * Update the specified user with roles.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'username' => 'required|string|max:255',
                'details' => 'nullable|string',
                'email' => 'unique|string',
                'role' => 'required|string|exists:roles,name',
                'phone' => 'nullable|string|max:20',
                'staff_number' => 'nullable|string|max:20',
            ]);

            $user = User::find($id);

            if (!$user) {
                return $this->errorResponse('User not found', 'User not found', 404);
            }

            $user->name = $request->input('username');
            $user->details = $request->input('details');
            $user->phone = $request->input('phone');
            $user->staff_number = $request->input('staff_number');
            $user->save();

            $user->syncRoles([$request->input('role')]);

            return $this->ResSuccess([
                'user' => $user,
                'message' => 'User updated successfully'
            ]);
        } catch (ValidationException $e) {
            return $this->ResError([
                'user' => null,
                'message' => 'Validation error',
                'errors' => $e->validator->errors()->all()
            ], 422);
        } catch (\Exception $e) {
            return $this->ResError([
                'user' => null,
                'message' => 'Failed to update user',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  int  $id
     */
    public function destroy($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return $this->ResError(['message' => 'User not found']);
            }

            $user->syncRoles([]);

            $user->delete();

            return $this->ResSuccess([
                'message' => 'User deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return $this->ResError([
                'message' => 'Failed to delete user',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUserPermissions(Request $request, $userId)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'permissions' => 'required|array',
                'permissions.*' => 'string|exists:permissions,name', // Ensure permissions exist in DB
            ]);

            // Find the user
            $user = User::findOrFail($userId);

            // Sync user-specific permissions (removes old ones and sets new ones)
            $user->syncPermissions($validated['permissions']);

            return $this->ResSuccess([
                'user' => $user,
                'permissions' => $user->permissions,
                'message' => 'User permissions updated successfully'
            ], 200);
        } catch (ValidationException $e) {
            return $this->ResError([
                'user' => null,
                'message' => 'Validation error',
                'errors' => $e->validator->errors()->all()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Failed to update user permissions', [
                'error' => $e->getMessage(),
                'userId' => $userId,
                'permissions' => $validated['permissions'],
            ]);

            return $this->ResError([
                'user' => null,
                'message' => 'Failed to update user permissions',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}
