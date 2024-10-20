<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\City;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $city = City::where('id', '=', $this->city)->first();

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'position' => $this->position,
            'email' => $this->email,
            'password' => $this->password,
            'address_line_1' => $this->address_line_1,
            'city' => $this->city,
            'city_name' => $city ? $city['name'] : '',
            'barangay' => $this->barangay,
            'contact_number' => $this->contact_number,
            'image' => $this->image,
            'role' => $this->role
        ];
    }
}