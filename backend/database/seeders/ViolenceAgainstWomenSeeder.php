<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ViolenceAgainstWomen;
use App\Models\Barangay;
use Carbon\Carbon;

class ViolenceAgainstWomenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $barangays = Barangay::all();
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        $vaws = [];

        foreach ($barangays as $b) {
            foreach (range(2020, $currentYear) as $year) { // Iterate over the years
                $months = $year == $currentYear
                    ? range(1, $currentMonth) // Current year: up to the current month
                    : range(1, 12); // Past years: all months

                foreach ($months as $monthNumber) {
                    $month = Carbon::createFromDate(null, $monthNumber)->format('F'); // Convert to month name

                    $physical_abuse = rand(1, 5);
                    $sexual_abuse = rand(1, 5);
                    $psychological_abuse = rand(1, 5);
                    $economic_abuse = rand(1, 5);
                    $issued_bpo = rand(1, 5);
                    $referred_lowdo = rand(1, 5);
                    $referred_pnp = rand(1, 5);
                    $referred_nbi = rand(1, 5);
                    $referred_court = rand(1, 5);
                    $referred_medical = rand(1, 5);
                    $trainings = rand(1, 5);
                    $counseling = rand(1, 5);
                    $iec = rand(1, 5);
                    $fund_allocation = rand(1, 5);

                    $number_vaw = $physical_abuse + $sexual_abuse + $psychological_abuse + $economic_abuse;

                    $vaws[] = [
                        'month' => $month,
                        'year' => $year,
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
                        'status' => 'Completed',
                    ];
                }
            }
        }

        // Bulk insert data for efficiency
        ViolenceAgainstWomen::insert($vaws);
    }
}
