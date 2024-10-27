<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Settings;
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
        $barangays = Barangay::all();

        foreach ($barangays as $brgy) {
            Settings::create([
                'barangay' => $brgy->name  // Assumes 'barangay' is the name field in Barangay table
            ]);
        }
    }
}
