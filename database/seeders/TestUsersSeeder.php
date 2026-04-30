<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class TestUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = Role::all();

        foreach ($roles as $role) {
            $this->createTestUser($role);
        }
    }

    /**
     * Create a test user for the given role.
     *
     * @param \Spatie\Permission\Models\Role $role
     * @return void
     */
    private function createTestUser(Role $role)
    {
        $roleName = $role->name;
        $email = $roleName . '@gmail.com';

        User::create([
            'name' => ucfirst($roleName) . ' User',
            'email' => $email,
            'password' => bcrypt('password'),
        ])->assignRole($role);
    }
}
