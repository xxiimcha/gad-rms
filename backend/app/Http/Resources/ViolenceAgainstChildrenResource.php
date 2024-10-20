<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ViolenceAgainstChildrenResource extends JsonResource
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
            'number_vac' => $this->number_vac ?? 0,
            'male' => $this->male ?? 0,
            'female' => $this->female ?? 0,
            'range_one' => $this->range_one ?? 0,
            'range_two' => $this->range_two ?? 0,
            'range_three' => $this->range_three ?? 0,
            'range_four' => $this->range_four ?? 0,
            'range_five' => $this->range_five ?? 0,
            'physical_abuse' => $this->physical_abuse ?? 0,
            'sexual_abuse' => $this->sexual_abuse ?? 0,
            'psychological_abuse' => $this->psychological_abuse ?? 0,
            'neglect' => $this->neglect ?? 0,
            'others' => $this->others ?? 0,
            'immediate_family' => $this->immediate_family ?? 0,
            'other_close_relative' => $this->other_close_relative ?? 0,
            'acquaintance' => $this->acquaintance ?? 0,
            'stranger' => $this->stranger ?? 0,
            'local_official' => $this->local_official ?? 0,
            'law_enforcer' => $this->law_enforcer ?? 0,
            'other_guardians' => $this->other_guardians ?? 0,
            'referred_pnp' => $this->referred_pnp ?? 0,
            'referred_nbi' => $this->referred_nbi ?? 0,
            'referred_medical' => $this->referred_medical ?? 0,
            'referred_legal_assist' => $this->referred_legal_assist ?? 0,
            'referred_others' => $this->referred_others ?? 0,
            'month' => $this->month,
            'barangay' => $this->barangay ?? 0,
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
