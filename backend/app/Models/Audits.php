<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;


class Audits extends Model implements \OwenIt\Auditing\Contracts\Audit
{
    use HasFactory;
    use \OwenIt\Auditing\Audit;

    protected $guarded = [];

    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($audit) {
            // Ensure the user is authenticated
            if (Auth::check()) {
                $audit->user_id = Auth::id();
            } else {
                Log::warning('No authenticated user found when creating audit.');
                $audit->user_id = null; // Or handle accordingly
            }
        });
    }
}
