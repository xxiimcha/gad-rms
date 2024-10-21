<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ViolenceAgainstChildren;
use App\Models\Barangay;

class AnalysisController extends Controller
{
    public function getBarangays()
    {
        $barangays = Barangay::all();
        return response()->json($barangays);
    }

    public function getPrescriptiveAnalysis(Request $request)
    {
        try {
            $barangayId = $request->query('barangay', 'All');

            // Fetch data based on barangay selection
            $cases = $barangayId === 'All'
                ? ViolenceAgainstChildren::with('barangay')->get()
                : ViolenceAgainstChildren::where('barangay', $barangayId)->with('barangay')->get();

            // Prepare analysis based on the data
            $analysisData = $this->analyzeData($cases);

            return response()->json($analysisData);
        } catch (\Exception $e) {
            \Log::error('Error in getPrescriptiveAnalysis: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while processing the analysis.'], 500);
        }
    }

    private function analyzeData($cases)
    {
        $groupedData = [];
        foreach ($cases as $case) {
            $key = $case->barangay . '-' . $case->month;
            if (!isset($groupedData[$key])) {
                $groupedData[$key] = [];
            }
            $groupedData[$key][] = $case;
        }

        $result = [];
        foreach ($groupedData as $key => $casesGroup) {
            // Get the first case in the group (all cases in a group have the same barangay and month)
            $sampleCase = $casesGroup[0];

            // Retrieve the barangay name from the Barangay model based on the case's barangay ID
            $barangay = Barangay::find($sampleCase->barangay);
            $barangayName = $barangay ? $barangay->name : 'Unknown Barangay';

            // Find the case type with the maximum count
            $caseTypes = [
                'Physical Abuse' => $sampleCase->physical_abuse,
                'Sexual Abuse' => $sampleCase->sexual_abuse,
                'Psychological Abuse' => $sampleCase->psychological_abuse,
                'Neglect' => $sampleCase->neglect,
                'Others' => $sampleCase->others,
            ];

            $maxType = array_keys($caseTypes, max($caseTypes))[0];
            $maxCount = $caseTypes[$maxType];

            $recommendedAction = $this->getRecommendedAction($maxType);

            $result[] = [
                'barangay' => $barangayName,
                'month' => $sampleCase->month,
                'case_type' => $maxType,
                'case_count' => $maxCount,
                'recommended_action' => $recommendedAction
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
