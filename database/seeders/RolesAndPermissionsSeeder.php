<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use DB;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Create the initial roles and permissions for the Nursing System.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Permission::truncate();
        Role::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        /**
         * Permissions
         */
        $permissions = [
            // Exams
            'view exams',
            'manage exams',
            'attempt exams',
            'review exams',
            'publish exams',

            // Content
            'view content',
            'manage content',
            'create content',
            'edit content',
            'delete content',

            // Users
            'view users',
            'manage users',

            // Tutors & Teachers
            'view tutors',
            'manage tutors',
            'view teachers',
            'manage teachers',

            // Students
            'view students',
            'manage students',

            // Clients (organizations)
            'view clients',
            'manage clients',

            // Reports
            'view reports',
            'generate reports',

            // Roles
            'assign roles',
            'manage roles',

            // Schools
            'create schools',
            'manage schools',
            'assign teachers to schools',
            'assign students to schools',
            'assign exams to students',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        /**
         * Roles and Permissions Mapping
         */
        $roles_permissions = [
            'super-admin' => Permission::all(), // everything

            'admin' => [
                'view users',
                'manage users',
                'view tutors',
                'manage tutors',
                'view clients',
                'manage clients',
                'view reports',
                'generate reports',
                'assign roles',
                'manage roles',
                'view exams',
                'manage exams',
                'publish exams',
                'create schools',
                'manage schools',
            ],

            'tutor' => [
                'view exams',
                'manage exams',
                'review exams',
                'view content',
                'create content',
                'edit content',
                'delete content',
                'create schools',
                'manage schools',
                'assign teachers to schools',
                'assign students to schools',
                'assign exams to students',
            ],

            'teacher' => [
                'view exams',
                'manage exams',
                'review exams',
                'view students',
                'manage students',
                'assign exams to students',
            ],

            'content_dev' => [
                'view content',
                'create content',
                'edit content',
                'delete content',
            ],

            'client' => [
                'view exams',
                'attempt exams',
                'review exams',
                'view reports',
            ],

            'student' => [
                'attempt exams',
                'review exams',
                'view reports',
            ],
        ];

        foreach ($roles_permissions as $role_name => $perms) {
            $role = Role::create(['name' => $role_name]);
            $role->givePermissionTo($perms);
        }
    }
}
