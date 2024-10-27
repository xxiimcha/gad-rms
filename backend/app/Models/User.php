<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use App\Notifications\ResetPasswordNotification;
use App\Models\Barangay;

class User extends Authenticatable implements Auditable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasFactory;
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'first_name',
        'last_name',
        'position',
        'contact_number',
        'city',
        'barangay',
        'address_line_1',
        'password',
        'role',
        'otp',
        'otp_expires_at',
        'two_factor',
        'two_factor_expires_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token', 'two_factor', 'two_factor_expires_at'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_expires_at' => 'datetime',
    ];

    protected $auditExclude = ['password'];

    public function sendPasswordResetNotification($token)
    {
        $url = env('APP_URL') . '/reset-password?token=' . $token;
        $this->notify(new ResetPasswordNotification($url));
    }

    public function barangayRelation()
    {
        \Log::info("Attempting to fetch Barangay for user with barangay ID: " . $this->barangay);
        return $this->belongsTo(Barangay::class, 'barangay', 'id');
    }

}
