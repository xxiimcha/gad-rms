<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ViolenceAgainstWomen;
use App\Models\Barangay;

class VAWAnalysisController extends Controller
{
    public function getBarangays()
    {
        $barangays = Barangay::all();
        return response()->json($barangays);
    }

    public function getPredictiveAnalysis(Request $request)
    {
        try {
            $barangay = $request->query('barangay', null);

            // Fetch data based on the barangay selection
            $cases = $barangay ? ViolenceAgainstWomen::where('barangay', $barangay)->get() : ViolenceAgainstWomen::all();

            // Perform analysis logic and prepare the data
            $analysisData = $this->analyzeData($cases);

            // Return as JSON response
            return response()->json($analysisData);
        } catch (\Exception $e) {
            \Log::error('Error in getPredictiveAnalysis: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while processing the analysis.'], 500);
        }
    }

    private function analyzeData($cases)
    {
        $result = [];
        foreach ($cases as $case) {
            $caseTypes = [
                'Physical Abuse' => $case->physical_abuse,
                'Sexual Abuse' => $case->sexual_abuse,
                'Psychological Abuse' => $case->psychological_abuse,
                'Neglect' => $case->neglect,
                'Others' => $case->others,
            ];

            // Find the type with the maximum count
            $maxType = array_keys($caseTypes, max($caseTypes))[0];
            $maxCount = $caseTypes[$maxType];

            $recommendedAction = $this->getRecommendedAction($maxType);

            $result[] = [
                'barangay' => $case->barangay,
                'month' => $case->month,
                'case_type' => $maxType,
                'case_count' => $maxCount,
                'recommended_action' => $recommendedAction,
            ];
        }
        return $result;
    }

    private function getRecommendedAction($caseType)
    {
        switch ($caseType) {
            case 'Physical Abuse':
                return "Increase law enforcement presence and provide counseling.";
            case 'Sexual Abuse':
                return "Implement safety seminars and provide support groups.";
            case 'Psychological Abuse':
                return "Organize psychological counseling and stress management workshops.";
            case 'Neglect':
                return "Conduct community awareness programs and regular check-ups.";
            default:
                return "Investigate further and tailor interventions as necessary.";
        }
    }
}
