<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use App\Models\ViolenceAgainstWomen;
use App\Models\ViolenceAgainstChilden;

class Barangay extends Model implements Auditable
{
    use HasFactory;
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    protected $guarded = [];

    public function violences_against_women()
    {
        return $this->hasMany(ViolenceAgainstWomen::class, 'barangay');
    }

    public function violences_against_children()
    {
        return $this->hasMany(ViolenceAgainstChilden::class, 'barangay');
    }
}
