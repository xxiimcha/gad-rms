<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use App\Models\Barangay;

class ViolenceAgainstChildren extends Model implements Auditable
{
    use HasFactory;
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;
    protected $table = 'violence_against_children';
    protected $guarded = [];
    // protected $fillable = [
    //     'month',
    //     'number_vac',
    //     'male',
    //     'female',
    //     'range_one',
    //     'range_two',
    //     'range_three',
    //     'range_four',
    //     'range_five',
    //     'physical_abuse',
    //     'sexual_abuse',
    //     'psychological_abuse',
    //     'neglect',
    //     'others',
    //     'immediate_family',
    //     'other_close_relative',
    //     'acquaintance',
    //     'stranger',
    //     'local_official',
    //     'law_enforcer',
    //     'other_guardians',
    //     'referred_pnp',
    //     'referred_nbi',
    //     'referred_medical',
    //     'referred_legal_assist',
    //     'referred_others',
    //     'barangay',
    //     'trainings',
    //     'counseling',
    //     'iec',
    //     'fund_allocation',
    //     'remarks'
    // ];
    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay', 'id');
    }
}
