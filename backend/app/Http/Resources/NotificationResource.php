<?php

// In app/Http/Resources/NotificationResource.php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'barangay' => $this->barangay,
            'message' => $this->message,
            'deadline_date' => $this->deadline_date,
            'is_read' => $this->is_read,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
