<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\User::create([
            'first_name' => 'Gayle',
            'last_name' => 'Ronquillo',
            'email' => 'ronquillogaylemark@gmail.com',
            'password' => Hash::make('12345'),
            'email_verified_at' => now(),
            'address_line_1' => 'Cent. 2 Narra St.',
            'role' => 'super admin',
            'city' => 1,
            'barangay' => 1,
            'contact_number' => '0923462374'
        ]);

        \App\Models\User::create([
            'first_name' => 'Prince',
            'last_name' => 'Balbin',
            'email' => 'princebalbin23@gmail.com',
            'password' => Hash::make('12345'),
            'email_verified_at' => now(),
            'address_line_1' => 'Villa Cuana',
            'role' => 'super admin',
            'city' => 1,
            'barangay' => 2,
            'contact_number' => '0923462374'
        ]);

        \App\Models\User::create([
            'first_name' => 'Gayle',
            'last_name' => 'Mark',
            'email' => 'charmaine.l.d.cator@gmail.com',
            'password' => Hash::make('12345'),
            'email_verified_at' => now(),
            'address_line_1' => 'Narra',
            'role' => 'super admin',
            'city' => 1,
            'barangay' => 2,
            'contact_number' => '0923462374'
        ]);

        \App\Models\User::factory(26)->create();
    }
}
