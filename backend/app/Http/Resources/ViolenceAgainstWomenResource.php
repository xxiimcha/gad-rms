<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ViolenceAgainstWomenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'year' => $this->year,
            'physical_abuse' => $this->physical_abuse ?? 0,
            'sexual_abuse' => $this->sexual_abuse ?? 0,
            'psychological_abuse' => $this->psychological_abuse ?? 0,
            'economic_abuse' => $this->economic_abuse ?? 0,
            'issued_bpo' => $this->issued_bpo ?? 0,
            'referred_lowdo' => $this->referred_lowdo ?? 0,
            'referred_pnp' => $this->referred_pnp ?? 0,
            'referred_nbi' => $this->referred_nbi ?? 0,
            'referred_court' => $this->referred_court ?? 0,
            'referred_medical' => $this->referred_medical ?? 0,
            'number_vaw' => $this->number_vaw ?? 0,
            'month' => $this->month,
            'barangay' => $this->barangay,
            'trainings' => $this->trainings ?? 0,
            'counseling' => $this->counseling ?? 0,
            'iec' => $this->iec ?? 0,
            'fund_allocation' => $this->fund_allocation ?? 0,
            'remarks' => $this->remarks ?? 'RECORD ONLY',
            'status' => $this->status,
            'created_at' => $this->created_at->toDateString(),
            'updated_at' => $this->updated_at->toDateString()
        ];
    }
}
