<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'barangay',   // Store the name of the barangay
        'message',
        'deadline_date',
        'is_read',
    ];

    public function barangay()
    {
        return $this->belongsTo(Barangay::class, 'barangay', 'name');
    }

}
