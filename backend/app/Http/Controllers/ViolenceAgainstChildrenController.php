<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Resources\ViolenceAgainstChildrenResource;
use App\Models\ViolenceAgainstChildren;
use App\Models\Barangay;


class ViolenceAgainstChildrenController extends Controller
{
    public function get_all_vacs(Request $request) {
        $currentUser = $request->user();
        if($currentUser->role === 'super admin') {
            $year = $request->year;
            $month = $request->month;

            $barangays = Barangay::all()->pluck('name');

            $barangayData = [];
            foreach ($barangays as $barangay) {
                $brgy = Barangay::where('name', $barangay)->first();
                $vac = ViolenceAgainstChildren::where('month', $month)
                ->where('barangay', $brgy['id'])
                ->whereBetween('violence_against_children.created_at', [
                    Carbon::create($year, 1, 1)->startOfYear(),
                    Carbon::create($year, 12, 31)->endOfYear()
                ])
                ->first();

                if(isset($vac)) {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vac' => $vac->number_vac ?? 0,
                        'male' => $vac->male ?? 0,
                        'female' => $vac->female ?? 0,
                        'range_one' => $vac->range_one ?? 0,
                        'range_two' => $vac->range_two ?? 0,
                        'range_three' => $vac->range_three ?? 0,
                        'range_four' => $vac->range_four ?? 0,
                        'range_five' => $vac->range_five ?? 0,
                        'physical_abuse' => $vac->physical_abuse ?? 0,
                        'sexual_abuse' => $vac->sexual_abuse ?? 0,
                        'psychological_abuse' => $vac->psychological_abuse ?? 0,
                        'neglect' => $vac->neglect ?? 0,
                        'others' => $vac->others ?? 0,
                        'immediate_family' => $vac->immediate_family ?? 0,
                        'other_close_relative' => $vac->other_close_relative ?? 0,
                        'acquaintance' => $vac->acquaintance ?? 0,
                        'stranger' => $vac->stranger ?? 0,
                        'local_official' => $vac->local_official ?? 0,
                        'law_enforcer' => $vac->law_enforcer ?? 0,
                        'other_guardians' => $vac->other_guardians ?? 0,
                        'referred_pnp' => $vac->referred_pnp ?? 0,
                        'referred_nbi' => $vac->referred_nbi ?? 0,
                        'referred_medical' => $vac->referred_medical ?? 0,
                        'referred_legal_assist' => $vac->referred_legal_assist ?? 0,
                        'referred_others' => $vac->referred_others ?? 0,
                        'trainings' => $vac->trainings ?? 0,
                        'counseling' => $vac->counseling ?? 0,
                        'iec' => $vac->iec ?? 0,
                        'fund_allocation' => $vac->fund_allocation ?? 0,
                        'total_actions' => $vac->referred_others + $vac->referred_lowdo + $vac->referred_pnp + $vac->referred_nbi + $vac->referred_medical + $vac->referred_legal_assist,
                        'status' => $vac->status
                    ];
                } else {
                    $barangayData[] = [
                        'month' => $month,
                        'barangay' => $barangay,
                        'number_vac' => 0,
                        'male' => 0,
                        'female' => 0,
                        'range_one' => 0,
                        'range_two' => 0,
                        'range_three' => 0,
                        'range_four' => 0,
                        'range_five' => 0,
                        'physical_abuse' => 0,
                        'sexual_abuse' => 0,
                        'psychological_abuse' => 0,
                        'neglect' => 0,
                        'others' => 0,
                        'immediate_family' => 0,
                        'other_close_relative' => 0,
                        'acquaintance' => 0,
                        'stranger' => 0,
                        'local_official' => 0,
                        'law_enforcer' => 0,
                        'other_guardians' => 0,
                        'referred_pnp' => 0,
                        'referred_nbi' => 0,
                        'referred_medical' => 0,
                        'referred_legal_assist' => 0,
                        'referred_others' => 0,
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
            $vac = ViolenceAgainstChildren::where('month', $month)
            ->where('barangay', $currentUser->barangay)
            ->whereBetween('violence_against_children.created_at', [
                Carbon::create($year, 1, 1)->startOfYear(),
                Carbon::create($year, 12, 31)->endOfYear()
            ])
            ->first();

            $brgy = Barangay::where('id', $currentUser->barangay)->first();

            if(isset($vac)) {
                $barangayData[] = [
                    'month' => $month,
                    'barangay' => $brgy->name,
                    'number_vac' => $vac->number_vac ?? 0,
                    'physical_abuse' => $vac->physical_abuse ?? 0,
                    'sexual_abuse' => $vac->sexual_abuse ?? 0,
                    'psychological_abuse' => $vac->psychological_abuse ?? 0,
                    'economic_abuse' => $vac->economic_abuse ?? 0,
                    'issued_bpo' => $vac->issued_bpo ?? 0,
                    'referred_lowdo' => $vac->referred_lowdo ?? 0,
                    'referred_pnp' => $vac->referred_pnp ?? 0,
                    'referred_nbi' => $vac->referred_nbi ?? 0,
                    'referred_court' => $vac->referred_court ?? 0,
                    'referred_medical' => $vac->referred_medical ?? 0,
                    'trainings' => $vac->trainings ?? 0,
                    'counseling' => $vac->counseling ?? 0,
                    'iec' => $vac->iec ?? 0,
                    'fund_allocation' => $vac->fund_allocation ?? 0,
                    'total_actions' => 0,
                    'status' => $vac->status
                ];
            }

            return response()->json($barangayData);
        }
    }

    public function vac(Request $request) {
        $vac = ViolenceAgainstChildren::findOrFail($request->id);

        return $vac;

        return new ViolenceAgainstChildren($vac);
    }

    public function vacs(Request $request)
    {
        $currentUser = $request->user();

        if($currentUser->role === 'super admin') {
            $vacs = ViolenceAgainstChildren::all();
        } else {
            $vacs = ViolenceAgainstChildren::where('barangay', '=', $currentUser->barangay)->get();
        }
        return ViolenceAgainstChildrenResource::collection($vacs);
    }

    public function store(Request $request)  {
        $data = $this->build_data($request);
        
        $violenceAgainstChildren = ViolenceAgainstChildren::create($data);

        return new ViolenceAgainstChildrenResource($violenceAgainstChildren);
        // return new ViolenceAgainstChildrenResource(ViolenceAgainstChildren::create($request->all()));
    }

    public function update(Request $request)
    {
        $vacs = ViolenceAgainstChildren::findOrFail($request->id);

        $data = $this->build_data($request);

        $vacs->update($data);

        return new ViolenceAgainstChildrenResource($vacs);
    }

    public function admin_update(Request $request)
    {
        $vacs = ViolenceAgainstChildren::findOrFail($request->id);

        $vacs->update([
            'remarks' => $request->remarks ?? 'RECORD ONLY',
            'status' => $request->status
        ]);

        return new ViolenceAgainstChildrenResource($vacs);
    }


    public function destroy(Request $request)
    {
        $user = ViolenceAgainstChildren::findOrFail($request->id);
        return $user->delete();
    }

    private function build_data($request) {
        $data = [
            'number_vac' => $request->number_vac ?? 0,
            'remarks' => $request->remarks ?? 'RECORD ONLY',
            'month' => $request->month,
            'barangay' => $request->barangay ?? 0,
            'status' => $request->status
        ];
        
        // Handling genderRows
        foreach ($request->genderRows as $row) {
            if ($row['gender'] === 'Male') {
                $data['male'] = $row['genderValue'];
            } elseif ($row['gender'] === 'Female') {
                $data['female'] = $row['genderValue'];
            }
        }
        
        // Handling ageRows
        foreach ($request->ageRows as $row) {
            switch ($row['age']) {
                case '0-4yr':
                    $data['range_one'] = $row['ageValue'];
                    break;
                case '6-9yr':
                    $data['range_two'] = $row['ageValue'];
                    break;
                case '10-14yr':
                    $data['range_three'] = $row['ageValue'];
                    break;
                case '15-17yr':
                    $data['range_four'] = $row['ageValue'];
                    break;
                case '18 up PWD':
                    $data['range_five'] = $row['ageValue'];
                    break;
            }
        }
        
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
                case 'Neglect':
                    $data['neglect'] = $row['abuseValue'];
                    break;
                case 'Others':
                    $data['others'] = $row['abuseValue'];
                    break;
            }
        }
        
        // Handling perpetratorsRows
        foreach ($request->perpetratorsRows as $row) {
            switch ($row['perpetrator']) {
                case 'Immediate Family':
                    $data['immediate_family'] = $row['perpetratorValue'];
                    break;
                case 'Other Close Relative(s)':
                    $data['other_close_relative'] = $row['perpetratorValue'];
                    break;
                case 'Acquaintance':
                    $data['acquaintance'] = $row['perpetratorValue'];
                    break;
                case 'Stranger':
                    $data['stranger'] = $row['perpetratorValue'];
                    break;
                case 'Local Official':
                    $data['local_official'] = $row['perpetratorValue'];
                    break;
                case 'Law Enforcer':
                    $data['law_enforcer'] = $row['perpetratorValue'];
                    break;
                case 'Other (Guardians)':
                    $data['other_guardians'] = $row['perpetratorValue'];
                    break;
            }
        }
        
        // Handling actionRows
        foreach ($request->actionRows as $row) {
            switch ($row['action']) {
                case 'Referred to PNP':
                    $data['referred_pnp'] = $row['actionValue'];
                    break;
                case 'Referred to NBI':
                    $data['referred_nbi'] = $row['actionValue'];
                    break;
                case 'Referred for Medical':
                    $data['referred_medical'] = $row['actionValue'];
                    break;
                case 'Referred for Legal Assist':
                    $data['referred_legal_assist'] = $row['actionValue'];
                    break;
                case 'Others: (NGO, GBOS)':
                    $data['referred_others'] = $row['actionValue'];
                    break;
            }
        }
        
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
        return $data;
    }

    public function get_all_vacs_by_param(Request $request) {
        $currentUser = $request->user();
        
        // Define months for iteration
        $monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Get all barangays
        $barangays = Barangay::all()->pluck('name');
        $vacsData = [];
        
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
                $vaw = ViolenceAgainstChildren::where('barangay', $brgy['id'])
                ->where('month', $month)
                ->whereBetween('violence_against_children.created_at', [
                    Carbon::create(date('Y'), 1, 1)->startOfYear(),
                    Carbon::create(date('Y'), 12, 31)->endOfYear()
                ])
                ->first();
                
                // Append the data for the month
                $barangayData['data'][] = [
                    'month' => $month,
                    'total' => $vaw->number_vac ?? 0
                ];
            }
            
            $vacsData[] = $barangayData;
        }

        return response()->json($vacsData);
    }

    public function get_vacs_percentage(Request $request) {
        $currentMonth = $request->month;
        $data = ViolenceAgainstChildren::with('barangay')->get();

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

        $totalNeglectCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['neglect'];
        }, 0);

        $totalOthersCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['others'];
        }, 0);

        $totalMaleCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['male'];
        }, 0);

        $totalFemaleCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['female'];
        }, 0);

        $totalRangeOneCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['range_one'];
        }, 0);

        $totalRangeTwoCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['range_two'];
        }, 0);

        $totalRangeThreeCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['range_three'];
        }, 0);

        $totalRangeFourCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['range_four'];
        }, 0);

        $totalRangeFiveCases = array_reduce($currentMonthData, function($carry, $entry) {
            return $carry + $entry['range_five'];
        }, 0);
    
        $groupedData = [];
        foreach ($currentMonthData as $entry) {
            $barangayName = $entry['barangay']['name'];
            if (!isset($groupedData[$barangayName])) {
                $groupedData[$barangayName] = [
                    'male' => 0,
                    'female' => 0,
                    'range_one' => 0,
                    'range_two' => 0,
                    'range_three' => 0,
                    'range_four' => 0,
                    'range_five' => 0,
                    'physical_abuse' => 0,
                    'sexual_abuse' => 0,
                    'psychological_abuse' => 0,
                    'neglect' => 0,
                    'others' => 0
                ];
            }
            $groupedData[$barangayName]['male'] += $entry['male'];
            $groupedData[$barangayName]['female'] += $entry['female'];
            $groupedData[$barangayName]['range_one'] += $entry['range_one'];
            $groupedData[$barangayName]['range_two'] += $entry['range_two'];
            $groupedData[$barangayName]['range_three'] += $entry['range_three'];
            $groupedData[$barangayName]['range_four'] += $entry['range_four'];
            $groupedData[$barangayName]['range_five'] += $entry['range_five'];
            $groupedData[$barangayName]['physical_abuse'] += $entry['physical_abuse'];
            $groupedData[$barangayName]['sexual_abuse'] += $entry['sexual_abuse'];
            $groupedData[$barangayName]['psychological_abuse'] += $entry['psychological_abuse'];
            $groupedData[$barangayName]['neglect'] += $entry['neglect'];
            $groupedData[$barangayName]['others'] += $entry['others'];
        }
    
        $highestMale = [ 'barangay' => '', 'percentage' => 0 ];
        $highestFemale = [ 'barangay' => '', 'percentage' => 0 ];
        $highestRangeOne = [ 'barangay' => '', 'percentage' => 0 ];
        $highestRangeTwo = [ 'barangay' => '', 'percentage' => 0 ];
        $highestRangeThree = [ 'barangay' => '', 'percentage' => 0 ];
        $highestRangeFour = [ 'barangay' => '', 'percentage' => 0 ];
        $highestRangeFive = [ 'barangay' => '', 'percentage' => 0 ];
        $highestPhysical = [ 'barangay' => '', 'percentage' => 0 ];
        $highestSexual = [ 'barangay' => '', 'percentage' => 0 ];
        $highestPsychological = [ 'barangay' => '', 'percentage' => 0 ];
        $highestNeglect = [ 'barangay' => '', 'percentage' => 0 ];
        $highestOthers = [ 'barangay' => '', 'percentage' => 0 ];
        
        foreach ($groupedData as $barangay => $cases) {
            $malePercentage = ($totalMaleCases > 0) ? round(($cases['male'] / $totalMaleCases) * 100, 2) : 0;
            if ($malePercentage > $highestMale['percentage']) {
                $highestMale['barangay'] = $barangay;
                $highestMale['percentage'] = $malePercentage;
            }

            $femalePercentage = ($totalFemaleCases > 0) ? round(($cases['female'] / $totalFemaleCases) * 100, 2) : 0;
            if ($femalePercentage > $highestFemale['percentage']) {
                $highestFemale['barangay'] = $barangay;
                $highestFemale['percentage'] = $femalePercentage;
            }

            $rangeOnePercentage = ($totalRangeOneCases > 0) ? round(($cases['range_one'] / $totalRangeOneCases) * 100, 2) : 0;
            if ($rangeOnePercentage > $highestRangeOne['percentage']) {
                $highestRangeOne['barangay'] = $barangay;
                $highestRangeOne['percentage'] = $rangeOnePercentage;
            }

            $rangeTwoPercentage = ($totalRangeTwoCases > 0) ? round(($cases['range_two'] / $totalRangeTwoCases) * 100, 2) : 0;
            if ($rangeTwoPercentage > $highestRangeTwo['percentage']) {
                $highestRangeTwo['barangay'] = $barangay;
                $highestRangeTwo['percentage'] = $rangeTwoPercentage;
            }

            $rangeThreePercentage = ($totalRangeThreeCases > 0) ? round(($cases['range_three'] / $totalRangeThreeCases) * 100, 2) : 0;
            if ($rangeThreePercentage > $highestRangeThree['percentage']) {
                $highestRangeThree['barangay'] = $barangay;
                $highestRangeThree['percentage'] = $rangeThreePercentage;
            }

            $rangeFourPercentage = ($totalRangeFourCases > 0) ? round(($cases['range_four'] / $totalRangeFourCases) * 100, 2) : 0;
            if ($rangeFourPercentage > $highestRangeFour['percentage']) {
                $highestRangeFour['barangay'] = $barangay;
                $highestRangeFour['percentage'] = $rangeFourPercentage;
            }

            $rangeFivePercentage = ($totalRangeFiveCases > 0) ? round(($cases['range_five'] / $totalRangeFiveCases) * 100, 2) : 0;
            if ($rangeFivePercentage > $highestRangeFive['percentage']) {
                $highestRangeFive['barangay'] = $barangay;
                $highestRangeFive['percentage'] = $rangeFivePercentage;
            }

            $physicalPercentage = ($totalPhysicalCases > 0) ? round(($cases['physical_abuse'] / $totalPhysicalCases) * 100, 2) : 0;
            if ($physicalPercentage > $highestPhysical['percentage']) {
                $highestPhysical['barangay'] = $barangay;
                $highestPhysical['percentage'] = $physicalPercentage;
            }

            $sexualPercentage = ($totalSexualCases > 0) ? round(($cases['sexual_abuse'] / $totalSexualCases) * 100, 2) : 0;
            if ($sexualPercentage > $highestSexual['percentage']) {
                $highestSexual['barangay'] = $barangay;
                $highestSexual['percentage'] = $sexualPercentage;
            }

            $psychologicalPercentage = ($totalPsychologicalCases > 0) ? round(($cases['psychological_abuse'] / $totalPsychologicalCases) * 100, 2) : 0;
            if ($psychologicalPercentage > $highestPsychological['percentage']) {
                $highestPsychological['barangay'] = $barangay;
                $highestPsychological['percentage'] = $psychologicalPercentage;
            }

            $neglectPercentage = ($totalNeglectCases > 0) ? round(($cases['neglect'] / $totalNeglectCases) * 100, 2) : 0;
            if ($neglectPercentage > $highestNeglect['percentage']) {
                $highestNeglect['barangay'] = $barangay;
                $highestNeglect['percentage'] = $neglectPercentage;
            }

            $othersPercentage = ($totalOthersCases > 0) ? round(($cases['others'] / $totalOthersCases) * 100, 2) : 0;
            if ($othersPercentage > $highestOthers['percentage']) {
                $highestOthers['barangay'] = $barangay;
                $highestOthers['percentage'] = $othersPercentage;
            }
        }
    
        return response()->json([
            'male' => $highestMale,
            'female' => $highestFemale,
            'range_one' => $highestRangeOne,
            'range_two' => $highestRangeTwo,
            'range_three' => $highestRangeThree,
            'range_four' => $highestRangeFour,
            'range_five' => $highestRangeFive,
            'physical_abuse' => $highestPhysical,
            'sexual_abuse' => $highestSexual,
            'psychological_abuse' => $highestPsychological,
            'neglect' => $highestNeglect,
            'others' => $highestOthers
        ]);
    }

    public function forecast() {
        $casesData = ViolenceAgainstChildren::all();
    
        $groupedData = [];
        foreach ($casesData as $row) {
            $barangayId = $row->barangay;
            $month = $row->month;
            $cases = (int) $row->number_vac;
    
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
