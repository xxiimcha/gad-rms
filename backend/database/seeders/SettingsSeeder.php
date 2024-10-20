<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Settings;
use App\Models\User;
use App\Models\Barangay;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $users = User::all();

        foreach($users as $user){
            $brgy = Barangay::findOrFail($user->barangay);
            Settings::create([
                'email' => $user['email'],
                'barangay' => $brgy->name
            ]);
        }
    }
}
