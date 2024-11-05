<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Resources\ViolenceAgainstWomenResource;
use App\Models\ViolenceAgainstWomen;
use App\Models\Barangay;

class ViolenceAgainstWomenController extends Controller
{

    public function get_all_vaws(Request $request) {
        $currentUser = $request->user();
        if($currentUser->role === 'super admin') {
            $year = $request->year;
            $month = $request->month;

            $barangays = Barangay::all()->pluck('name');

            $barangayData = [];
            foreach ($barangays as $barangay) {
                $brgy = Barangay::where('name', $barangay)->first();
                $vaw = ViolenceAgainstWomen::where('month', $month)
                ->where('barangay', $brgy['id'])
                ->whereBetween('violence_against_women.created_at', [
                    Carbon::create($year, 1, 1)->startOfYear(),
                    Carbon::create($year, 12, 31)->endOfYear()
                ])
                ->first();

                if(isset($vaw)) {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vaw' => $vaw->number_vaw ?? 0,
                        'physical_abuse' => $vaw->physical_abuse ?? 0,
                        'sexual_abuse' => $vaw->sexual_abuse ?? 0,
                        'psychological_abuse' => $vaw->psychological_abuse ?? 0,
                        'economic_abuse' => $vaw->economic_abuse ?? 0,
                        'issued_bpo' => $vaw->issued_bpo ?? 0,
                        'referred_lowdo' => $vaw->referred_lowdo ?? 0,
                        'referred_pnp' => $vaw->referred_pnp ?? 0,
                        'referred_nbi' => $vaw->referred_nbi ?? 0,
                        'referred_court' => $vaw->referred_court ?? 0,
                        'referred_medical' => $vaw->referred_medical ?? 0,
                        'trainings' => $vaw->trainings ?? 0,
                        'counseling' => $vaw->counseling ?? 0,
                        'iec' => $vaw->iec ?? 0,
                        'fund_allocation' => $vaw->fund_allocation ?? 0,
                        'total_actions' => $vaw->issued_bpo + $vaw->referred_lowdo + $vaw->referred_pnp + $vaw->referred_nbi + $vaw->referred_medical + $vaw->referred_court,
                        'status' => $vaw->status
                    ];
                } else {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vaw' => 0,
                        'physical_abuse' => 0,
                        'sexual_abuse' => 0,
                        'psychological_abuse' => 0,
                        'economic_abuse' => 0,
                        'issued_bpo' => 0,
                        'referred_lowdo' => 0,
                        'referred_pnp' => 0,
                        'referred_nbi' => 0,
                        'referred_court' => 0,
                        'referred_medical' => 0,
                        'trainings' => 0,
                        'counseling' => 0,
                        'iec' => 0,
                        'fund_allocation' => 0,
                        'total_actions' => 0,
                        'status' => 'Not Submitted'
                    ];
                }
            }

            return response()->json($barangayData);
        } else {
            $year = $request->year;
            $month = $request->month;

            $barangayData = [];
            $vaw = ViolenceAgainstWomen::where('month', $month)
            ->where('barangay', $currentUser->barangay)
            ->whereBetween('violence_against_women.created_at', [
                Carbon::create($year, 1, 1)->startOfYear(),
                Carbon::create($year, 12, 31)->endOfYear()
            ])
            ->first();

            $brgy = Barangay::where('id', $currentUser->barangay)->first();

            if(isset($vaw)) {
                $barangayData[] = [
                    'month' => $month,
                    'barangay' => $brgy->name,
                    'number_vaw' => $vaw->number_vaw ?? 0,
                    'physical_abuse' => $vaw->physical_abuse ?? 0,
                    'sexual_abuse' => $vaw->sexual_abuse ?? 0,
                    'psychological_abuse' => $vaw->psychological_abuse ?? 0,
                    'economic_abuse' => $vaw->economic_abuse ?? 0,
                    'issued_bpo' => $vaw->issued_bpo ?? 0,
                    'referred_lowdo' => $vaw->referred_lowdo ?? 0,
                    'referred_pnp' => $vaw->referred_pnp ?? 0,
                    'referred_nbi' => $vaw->referred_nbi ?? 0,
                    'referred_court' => $vaw->referred_court ?? 0,
                    'referred_medical' => $vaw->referred_medical ?? 0,
                    'trainings' => $vaw->trainings ?? 0,
                    'counseling' => $vaw->counseling ?? 0,
                    'iec' => $vaw->iec ?? 0,
                    'fund_allocation' => $vaw->fund_allocation ?? 0,
                    'total_actions' => 0,
                    'status' => $vaw->status
                ];
            }

            return response()->json($barangayData);
        }
    }

    public function vaw(Request $request) {
        $vaw = ViolenceAgainstWomen::findOrFail($request->id);

        return new ViolenceAgainstWomenResource($vaw);
    }

    public function vaws(Request $request)
    {
        $currentUser = $request->user();

        if($currentUser->role === 'super admin') {
            $vaws = ViolenceAgainstWomen::all();
        } else {
            $vaws = ViolenceAgainstWomen::where('barangay', '=', $currentUser->barangay)->get();
        }

        return ViolenceAgainstWomenResource::collection($vaws);
    }

    public function store(Request $request)  {
        $data = $this->build_data($request);

        $violenceAgainstWomen = ViolenceAgainstWomen::create($data);

        return new ViolenceAgainstWomenResource($violenceAgainstWomen);
    }

    public function update(Request $request)
    {
        $vaws = ViolenceAgainstWomen::findOrFail($request->id);

        $data = $this->build_data($request);

        $vaws->update($data);

        return new ViolenceAgainstWomenResource($vaws);
    }

    public function admin_update(Request $request)
    {
        $vaws = ViolenceAgainstWomen::findOrFail($request->id);

        $vaws->update([
            'remarks' => $request->remarks ?? 'RECORD ONLY',
            'status' => $request->status
        ]);

        return new ViolenceAgainstWomenResource($vaws);
    }

    public function destroy(Request $request)
    {
        $user = ViolenceAgainstWomen::findOrFail($request->id);
        return $user->delete();
    }

    private function build_data($request) {
        $data = [
            'number_vaw' => $request->number_vaw ?? 0,
            'remarks' => $request->remarks ?? 'RECORD ONLY',
            'month' => $request->month,
            'barangay' => $request->barangay ?? 0,
            'status' => $request->status
        ];

        if(isset($request->abuseRows)) {
            // Handling abuseRows
            foreach ($request->abuseRows as $row) {
                switch ($row['abuseType']) {
                    case 'Physical Abuse':
                        $data['physical_abuse'] = $row['abuseValue'];
                        break;
                    case 'Sexual Abuse':
                        $data['sexual_abuse'] = $row['abuseValue'];
                        break;
                    case 'Psychological Abuse':
                        $data['psychological_abuse'] = $row['abuseValue'];
                        break;
                    case 'Economic Abuse':
                        $data['economic_abuse'] = $row['abuseValue'];
                        break;
                }
            }
        }

        if(isset($request->actionRows)) {
        // Handling actionRows
            foreach ($request->actionRows as $row) {
                switch ($row['action']) {
                    case 'Issued BPO':
                        $data['issued_bpo'] = $row['actionValue'];
                        break;
                    case 'Referred to LoWDO':
                        $data['referred_lowdo'] = $row['actionValue'];
                        break;
                    case 'Referred to PNP':
                        $data['referred_pnp'] = $row['actionValue'];
                        break;
                    case 'Referred to NBI':
                        $data['referred_nbi'] = $row['actionValue'];
                        break;
                    case 'Referred to Court':
                        $data['referred_court'] = $row['actionValue'];
                        break;
                    case 'Referred for Medical':
                        $data['referred_medical'] = $row['actionValue'];
                        break;
                }
            }
        }

        if(isset($request->programsRows)) {
        // Handling programsRows
            foreach ($request->programsRows as $row) {
                switch ($row['program']) {
                    case 'Trainings/Seminars':
                        $data['trainings'] = $row['programValue'];
                        break;
                    case 'Counseling':
                        $data['counseling'] = $row['programValue'];
                        break;
                    case 'IEC':
                        $data['iec'] = $row['programValue'];
                        break;
                    case 'Fund Allocation':
                        $data['fund_allocation'] = $row['programValue'];
                        break;
                }
            }
        }
        return $data;
    }

    public function get_all_vaws_by_param(Request $request) {
        $currentUser = $request->user();

        // Define months for iteration
        $monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Get all barangays
        $barangays = Barangay::all()->pluck('name');
        $vawsData = [];

        foreach ($barangays as $barangay) {
            $barangayData = [
                'name' => $barangay,
                'data' => []
            ];

            // Get barangay ID
            $brgy = Barangay::where('name', $barangay)->first();

            if (!$brgy) {
                continue; // Skip if barangay not found
            }

            foreach ($monthNames as $index => $month) {
                $vaw = ViolenceAgainstWomen::where('barangay', $brgy['id'])
                ->where('month', $month)
                ->whereBetween('violence_against_women.created_at', [
                    Carbon::create(date('Y'), 1, 1)->startOfYear(),
                    Carbon::create(date('Y'), 12, 31)->endOfYear()
                ])
                ->first();

                // Append the data for the month
                $barangayData['data'][] = [
                    'month' => $month,
                    'total' => $vaw->number_vaw ?? 0
                ];
            }

            $vawsData[] = $barangayData;
        }

        return response()->json($vawsData);
    }

    public function get_vaws_percentage(Request $request) {
        $currentMonth = $request->month;
        $data = ViolenceAgainstWomen::with('barangay')->get();
        $currentMonthData = array_filter($data->toArray(), function($entry) use ($currentMonth) {
            return $entry['month'] === $currentMonth;
        });

        $totalPhysicalCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['physical_abuse'];
        }, 0);

        $totalSexualCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['sexual_abuse'];
        }, 0);

        $totalPsychologicalCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['psychological_abuse'];
        }, 0);

        $totalEconomicCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['economic_abuse'];
        }, 0);

        $groupedData = [];
        foreach ($currentMonthData as $entry) {
            $barangayName = $entry['barangay']['name'];
            if (!isset($groupedData[$barangayName])) {
                $groupedData[$barangayName] = [
                    'physical' => 0,
                    'sexual' => 0,
                    'economic' => 0,
                    'psychological' => 0
                ];
            }
            $groupedData[$barangayName]['physical'] += $entry['physical_abuse'];
            $groupedData[$barangayName]['sexual'] += $entry['sexual_abuse'];
            $groupedData[$barangayName]['economic'] += $entry['economic_abuse'];
            $groupedData[$barangayName]['psychological'] += $entry['psychological_abuse'];
        }

        $highestPhysical = [
            'barangay' => '',
            'percentage' => 0
        ];

        $highestSexual = [
            'barangay' => '',
            'percentage' => 0
        ];

        $highestPsychological = [
            'barangay' => '',
            'percentage' => 0
        ];

        $highestEconomic = [
            'barangay' => '',
            'percentage' => 0
        ];

        foreach ($groupedData as $barangay => $cases) {
            // Calculate physical abuse percentage
            $physicalPercentage = ($totalPhysicalCases > 0) ? round(($cases['physical'] / $totalPhysicalCases) * 100, 2) : 0;
            if ($physicalPercentage > $highestPhysical['percentage']) {
                $highestPhysical['barangay'] = $barangay;
                $highestPhysical['percentage'] = $physicalPercentage;
            }

            // Calculate sexual abuse percentage
            $sexualPercentage = ($totalSexualCases > 0) ? round(($cases['sexual'] / $totalSexualCases) * 100, 2) : 0;
            if ($sexualPercentage > $highestSexual['percentage']) {
                $highestSexual['barangay'] = $barangay;
                $highestSexual['percentage'] = $sexualPercentage;
            }

            // Calculate psycho abuse percentage
            $psychologicalPercentage = ($totalPsychologicalCases > 0) ? round(($cases['psychological'] / $totalPsychologicalCases) * 100, 2) : 0;
            if ($physicalPercentage > $highestPsychological['percentage']) {
                $highestPsychological['barangay'] = $barangay;
                $highestPsychological['percentage'] = $psychologicalPercentage;
            }

            // Calculate echo abuse percentage
            $economicPercentage = ($totalEconomicCases > 0) ? round(($cases['economic'] / $totalEconomicCases) * 100, 2) : 0;
            if ($economicPercentage > $highestEconomic['percentage']) {
                $highestEconomic['barangay'] = $barangay;
                $highestEconomic['percentage'] = $economicPercentage;
            }
        }

        return response()->json([
            'physical' => $highestPhysical,
            'sexual' => $highestSexual,
            'psychological' => $highestPsychological,
            'economic' => $highestEconomic
        ]);
    }

    public function forecast() {
        $casesData = ViolenceAgainstWomen::all();

        $groupedData = [];
        foreach ($casesData as $row) {
            $barangayId = $row->barangay;
            $month = $row->month;
            $cases = (int) $row->number_vaw;

            $barangay = Barangay::find($barangayId);
            if ($barangay) {
                $barangayName = $barangay->name;
                $groupedData[$barangayName][] = [
                    'month' => $month,
                    'total' => $cases,
                ];
            }
        }

        $forecasts = [];

        foreach ($groupedData as $barangay => $data) {
            $monthlyTotals = array_fill(0, 12, ['month' => '', 'total' => 0]);

            foreach ($data as $monthData) {
                $monthIndex = date('n', strtotime($monthData['month'])) - 1;
                $monthlyTotals[$monthIndex]['month'] = date('F', mktime(0, 0, 0, $monthIndex + 1, 1));
                $monthlyTotals[$monthIndex]['total'] += $monthData['total'];
            }

            $finalData = array_filter($monthlyTotals, function($monthData) {
                return $monthData['month'] !== '';
            });

            $lastIndex = count($finalData) - 1;
            for ($i = count($finalData) - 1; $i >= 0; $i--) {
                if ($finalData[$i]['total'] > 0) {
                    $lastIndex = $i;
                    break;
                }
            }

            $nextMonthIndex = ($lastIndex + 2) % 12;
            $forecastValue = $finalData[$lastIndex]['total'];

            $finalData[] = [
                'month' => date('F', mktime(0, 0, 0, $nextMonthIndex + 1, 1)),
                'total' => max(0, $forecastValue)
            ];

            $forecasts[] = [
                'name' => $barangay,
                'data' => array_values($finalData),
            ];
        }

        return response()->json($forecasts);
    }


}
