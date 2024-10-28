<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ViolenceAgainstChildren;
use App\Models\Barangay;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AnalysisController extends Controller
{
    public function getBarangays()
    {
        Log::info('Fetching all barangays');
        $barangays = Barangay::all();
        return response()->json($barangays);
    }

    public function getPrescriptiveAnalysis(Request $request)
    {
        try {
            // Get the authenticated user
            $currentUser = Auth::user();

            // Check if user is authenticated
            if (!$currentUser) {
                Log::error('User not authenticated.');
                return response()->json(['error' => 'User not authenticated.'], 401);
            }

            Log::info('Current user role: ' . $currentUser->role);

            $barangayId = $request->query('barangay', 'All');
            Log::info('Requested barangay ID: ' . $barangayId);

            // Check if the user is a super admin or admin and adjust the data scope
            if ($currentUser->role === 'super_admin') {
                // Show all data for super admin
                Log::info('User is super admin, fetching all cases');
                $cases = $barangayId === 'All'
                    ? ViolenceAgainstChildren::with('barangay')->get()
                    : ViolenceAgainstChildren::where('barangay', $barangayId)->with('barangay')->get();
            } elseif ($currentUser->role === 'admin') {
                // Restrict data to the barangay associated with the admin user
                $adminBarangayId = $currentUser->barangay; // Assuming user's barangay is stored in 'barangay' field
                Log::info('User is admin, associated barangay ID: ' . $adminBarangayId);

                if ($barangayId === 'All' || $barangayId == $adminBarangayId) {
                    Log::info('Fetching cases for admin barangay');
                    $cases = ViolenceAgainstChildren::where('barangay', $adminBarangayId)->with('barangay')->get();
                } else {
                    Log::warning('Admin trying to access data from unauthorized barangay');
                    return response()->json(['error' => 'Access denied to this barangay data.'], 403);
                }
            } else {
                Log::warning('Unauthorized user role detected');
                return response()->json(['error' => 'Access denied.'], 403);
            }

            // Prepare analysis based on the data
            Log::info('Preparing analysis data');
            $analysisData = $this->analyzeData($cases);

            return response()->json($analysisData);
        } catch (\Exception $e) {
            Log::error('Error in getPrescriptiveAnalysis: ' . $e->getMessage());
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
            $sampleCase = $casesGroup[0];

            $barangay = Barangay::find($sampleCase->barangay);
            $barangayName = $barangay ? $barangay->name : 'Unknown Barangay';
            Log::info("Analyzing cases for Barangay: {$barangayName}, Month: {$sampleCase->month}");

            $caseTypes = [
                'Physical Abuse' => $sampleCase->physical_abuse,
                'Sexual Abuse' => $sampleCase->sexual_abuse,
                'Psychological Abuse' => $sampleCase->psychological_abuse,
                'Neglect' => $sampleCase->neglect,
                'Others' => $sampleCase->others,
            ];

            $maxType = array_keys($caseTypes, max($caseTypes))[0];
            $maxCount = $caseTypes[$maxType];
            Log::info("Most common case type: {$maxType} with count {$maxCount}");

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
