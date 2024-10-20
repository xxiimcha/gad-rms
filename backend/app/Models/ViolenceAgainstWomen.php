<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use App\Models\Barangay;

class ViolenceAgainstWomen extends Model implements Auditable
{
    use HasFactory;
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;
    protected $table = 'violence_against_women';
    protected $guarded = [];
    // protected $fillable = [
    //     'physical_abuse',
    //     'sexual_abuse',
    //     'psychological_abuse',
    //     'economic_abuse',
    //     'issued_bpo',
    //     'referred_lowdo',
    //     'referred_pnp',
    //     'referred_court',
    //     'referred_medical',
    //     'referred_nbi',
    //     'number_vaw',
    //     'month',
    //     'barangay',
    //     'trainings',
    //     'counseling',
    //     'iec',
    //     'fund_allocation',
    //     'remarks'
    // ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay');
    }
}
