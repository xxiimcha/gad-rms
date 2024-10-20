<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ViolenceAgainstWomen;
use App\Models\ViolenceAgainstChildren;

class ArchiveController extends Controller
{
    public function archives(Request $request)
    {
        $currentUser = $request->user();

        if($currentUser->role === 'super admin') {
            // Query for 'violence_against_women' table
            $vawArchive = \DB::table('violence_against_women')
            ->select(
                'id',
                'month',
                'created_at',
                \DB::raw("CONCAT(month, '_', YEAR(created_at), '_', 'Report') as file_name"),
                \DB::raw("'VAW' as file_type")
            )
            ->whereNotNull('deleted_at');

            // Query for 'violence_against_children' table
            $vacArchive = \DB::table('violence_against_children')
            ->select(
                'id',
                'month',
                'created_at',
                \DB::raw("CONCAT(month, '_', YEAR(created_at), '_', 'Report') as file_name"),
                \DB::raw("'VAC' as file_type")
            )
            ->whereNotNull('deleted_at');

            $archives = $vawArchive->union($vacArchive)->get();
        } else {
            // Query for 'violence_against_women' table
            $vawArchive = \DB::table('violence_against_women')
            ->select(
                'id',
                'month',
                'created_at',
                \DB::raw("CONCAT(month, '_', YEAR(created_at), '_', 'Report') as file_name"),
                \DB::raw("'VAW' as file_type")
            )
            ->whereNotNull('deleted_at')
            ->where('barangay', $currentUser->barangay);

            // Query for 'violence_against_children' table
            $vacArchive = \DB::table('violence_against_children')
            ->select(
                'id',
                'month',
                'created_at',
                \DB::raw("CONCAT(month, '_', YEAR(created_at), '_', 'Report') as file_name"),
                \DB::raw("'VAC' as file_type")
            )
            ->whereNotNull('deleted_at')
            ->where('barangay', $currentUser->barangay);

            $archives = $vawArchive->union($vacArchive)->get();

        }
        return $archives;
    }

    public function restore(Request $request)
    {
        if ($request->file_type === "VAW") {
            \DB::table('violence_against_women')
                ->where('id', $request->id)
                ->update(['deleted_at' => null]);
            
            return response()->json(['message' => 'Record restored successfully.']);
        }
    
        if ($request->file_type === "VAC") {
            \DB::table('violence_against_children')
                ->where('id', $request->id)
                ->update(['deleted_at' => null]);
    
            return response()->json(['message' => 'Record restored successfully.']);
        }
    }
}
