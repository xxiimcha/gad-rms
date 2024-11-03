<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ViolenceAgainstChildren;
use App\Models\Barangay;

class ViolenceAgainstChildrenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'];
        $barangays = Barangay::all();

        $vacs = []; // Initialize the array here

        foreach ($barangays as $b) {
            foreach ($months as $m) {
                // Generate random values
                $male = rand(1, 5);
                $female = rand(1, 5);
                $range_one = rand(1, 5);
                $range_two = rand(1, 5);
                $range_three = rand(1, 5);
                $range_four = rand(1, 5);
                $range_five = rand(1, 5);
                $physical_abuse = rand(1, 5);
                $sexual_abuse = rand(1, 5);
                $psychological_abuse = rand(1, 5);
                $neglect = rand(1, 5);
                $others = rand(1, 5);
                $immediate_family = rand(1, 5);
                $other_close_relative = rand(1, 5);
                $acquaintance = rand(1, 5);
                $stranger = rand(1, 5);
                $local_official = rand(1, 5);
                $law_enforcer = rand(1, 5);
                $other_guardians = rand(1, 5);
                $referred_pnp = rand(1, 5);
                $referred_nbi = rand(1, 5);
                $referred_medical = rand(1, 5);
                $referred_legal_assist = rand(1, 5);
                $referred_others = rand(1, 5);
                $trainings = rand(1, 5);
                $counseling = rand(1, 5);
                $iec = rand(1, 5);
                $fund_allocation = rand(1, 5);

                // Calculate the total for number_vac
                $number_vac = $physical_abuse + $sexual_abuse + $psychological_abuse + $neglect + $others;

                // Store the data in the array
                $vacs[] = [
                    'month' => $m,
                    'male' => $male,
                    'female' => $female,
                    'range_one' => $range_one,
                    'range_two' => $range_two,
                    'range_three' => $range_three,
                    'range_four' => $range_four,
                    'range_five' => $range_five,
                    'physical_abuse' => $physical_abuse,
                    'sexual_abuse' => $sexual_abuse,
                    'psychological_abuse' => $psychological_abuse,
                    'neglect' => $neglect,
                    'others' => $others,
                    'immediate_family' => $immediate_family,
                    'other_close_relative' => $other_close_relative,
                    'acquaintance' => $acquaintance,
                    'stranger' => $stranger,
                    'local_official' => $local_official,
                    'law_enforcer' => $law_enforcer,
                    'other_guardians' => $other_guardians,
                    'referred_pnp' => $referred_pnp,
                    'referred_nbi' => $referred_nbi,
                    'referred_medical' => $referred_medical,
                    'referred_legal_assist' => $referred_legal_assist,
                    'referred_others' => $referred_others,
                    'barangay' => $b->id,
                    'trainings' => $trainings,
                    'counseling' => $counseling,
                    'iec' => $iec,
                    'fund_allocation' => $fund_allocation,
                    'number_vac' => $number_vac,
                    'status' => 'Completed'
                ];
            }
        }

        foreach ($vacs as $vac) {
            ViolenceAgainstChildren::create([
                'month' => $vac['month'],
                'number_vac' => $vac['number_vac'],
                'male' => $vac['male'],
                'female' => $vac['female'],
                'range_one' => $vac['range_one'],
                'range_two' => $vac['range_two'],
                'range_three' => $vac['range_three'],
                'range_four' => $vac['range_four'],
                'range_five' => $vac['range_five'],
                'physical_abuse' => $vac['physical_abuse'],
                'sexual_abuse' => $vac['sexual_abuse'],
                'psychological_abuse' => $vac['psychological_abuse'],
                'neglect' => $vac['neglect'],
                'others' => $vac['others'],
                'immediate_family' => $vac['immediate_family'],
                'other_close_relative' => $vac['other_close_relative'],
                'acquaintance' => $vac['acquaintance'],
                'stranger' => $vac['stranger'],
                'local_official' => $vac['local_official'],
                'law_enforcer' => $vac['law_enforcer'],
                'other_guardians' => $vac['other_guardians'],
                'referred_pnp' => $vac['referred_pnp'],
                'referred_nbi' => $vac['referred_nbi'],
                'referred_medical' => $vac['referred_medical'],
                'referred_legal_assist' => $vac['referred_legal_assist'],
                'referred_others' => $vac['referred_others'],
                'barangay' => $vac['barangay'],
                'trainings' => $vac['trainings'],
                'counseling' => $vac['counseling'],
                'iec' => $vac['iec'],
                'fund_allocation' => $vac['fund_allocation'],
                'status' => $vac['status'],
            ]);
        }
    }
}
