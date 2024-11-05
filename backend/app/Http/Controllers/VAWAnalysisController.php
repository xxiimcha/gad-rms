<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ViolenceAgainstWomen;
use App\Models\Barangay;

class VAWAnalysisController extends Controller
{
    public function getPredictiveAnalysis(Request $request)
    {
        try {
            $currentUser = $request->user();
            $barangay = $request->query('barangay', null);

            // Role-based filtering
            if ($currentUser->role === 'super admin') {
                // Super admin can view all data, filtered by the optional barangay parameter
                $cases = $barangay
                    ? ViolenceAgainstWomen::where('barangay', $barangay)->with('barangayRelation')->get()
                    : ViolenceAgainstWomen::with('barangayRelation')->get();
            } elseif ($currentUser->role === 'admin') {
                // Admin can only view data for their assigned barangay
                $cases = ViolenceAgainstWomen::where('barangay', $currentUser->barangay)
                    ->with('barangayRelation')
                    ->get();
            } else {
                // If the role does not match "super admin" or "admin", return an unauthorized error
                return response()->json(['error' => 'Unauthorized access.'], 403);
            }

            // Perform analysis logic and prepare the data
            $analysisData = $this->analyzeData($cases);

            // Return as JSON response
            return response()->json($analysisData);
        } catch (\Exception $e) {
            \Log::error('Error in getPredictiveAnalysis: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while processing the analysis.', 'message' => $e->getMessage()], 500);
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

            // Get the barangay name using the correct relationship method
            $barangayName = $case->barangayRelation ? $case->barangayRelation->name : 'Unknown';

            $recommendedAction = $this->getRecommendedAction($maxType);

            $result[] = [
                'barangay' => $barangayName,
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
