<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;
use App\Models\Barangay;
use Carbon\Carbon;

class AuditsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $user = User::find($this->user_id);
        $brgy = null;
        if($user && $user->barangay) {
            $brgy = Barangay::find($user->barangay);
        }
        
        return [
            'id' => $this->id,
            'event' => $this->event,
            'email' => $user ? $user->email : "",
            'full_name' => $user ? $user->first_name . " " . $user->last_name : "",
            'barangay' => $brgy ? $brgy->name : "",
            'new_values' => $this->new_values,
            'old_values' => $this->old_values,
            'created_at' => $this->created_at ? $this->created_at->setTimezone('Asia/Manila')->format('m/d/Y h:i:s A') : null,
        ];
    }
}
