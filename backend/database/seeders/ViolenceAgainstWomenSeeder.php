<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\ViolenceAgainstWomen;
use App\Models\Barangay;

class ViolenceAgainstWomenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
        $barangays = Barangay::all();
        $vaws = [];

        foreach ($barangays as $b) {
            foreach ($months as $m) {
                $physical_abuse = rand(1,10);
                $sexual_abuse = rand(1,10);
                $psychological_abuse = rand(1,10);
                $economic_abuse = rand(1,10);
                $issued_bpo = rand(1,10);
                $referred_lowdo = rand(1,10);
                $referred_pnp = rand(1,10);
                $referred_nbi = rand(1,10);
                $referred_court = rand(1,10);
                $referred_medical = rand(1,10);
                $trainings = rand(1,10);
                $counseling = rand(1,10);
                $iec = rand(1,10);
                $fund_allocation = rand(1,10);

                $number_vaw = $physical_abuse + $sexual_abuse + $psychological_abuse + $economic_abuse +
                              $issued_bpo + $referred_lowdo + $referred_pnp + $referred_nbi + $referred_court + $referred_medical +
                              $trainings + $counseling + $iec + $fund_allocation;

                $vaws[] = [
                    'month' => $m,
                    'physical_abuse' => $physical_abuse,
                    'sexual_abuse' => $sexual_abuse,
                    'psychological_abuse' => $psychological_abuse,
                    'economic_abuse' => $economic_abuse,
                    'issued_bpo' => $issued_bpo,
                    'referred_lowdo' => $referred_lowdo,
                    'referred_pnp' => $referred_pnp,
                    'referred_nbi' => $referred_nbi,
                    'referred_court' => $referred_court,
                    'referred_medical' => $referred_medical,
                    'barangay' => $b->id,
                    'trainings' => $trainings,
                    'counseling' => $counseling,
                    'iec' => $iec,
                    'fund_allocation' => $fund_allocation,
                    'number_vaw' => $number_vaw,
                    'status' => 'Completed'
                ];
            }
        }

        foreach($vaws as $vaw){
            ViolenceAgainstWomen::create([
                'month' => $vaw['month'],
                'barangay' => $vaw['barangay'],
                'number_vaw' => $vaw['number_vaw'],
                'physical_abuse' => $vaw['physical_abuse'],
                'sexual_abuse' => $vaw['sexual_abuse'],
                'psychological_abuse' => $vaw['psychological_abuse'],
                'economic_abuse' => $vaw['economic_abuse'],
                'issued_bpo' => $vaw['issued_bpo'],
                'referred_lowdo' => $vaw['referred_lowdo'],
                'referred_pnp' => $vaw['referred_pnp'],
                'referred_nbi' => $vaw['referred_nbi'],
                'referred_court' => $vaw['referred_court'],
                'referred_medical' => $vaw['referred_medical'],
                'trainings' => $vaw['trainings'],
                'counseling' => $vaw['counseling'],
                'iec' => $vaw['iec'],
                'fund_allocation' => $vaw['fund_allocation'],
                'status' => $vaw['status'],
            ]);
        }
    }
}
