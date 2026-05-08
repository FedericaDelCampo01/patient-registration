<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'country_code',
        'phone_number',
        'document_photo',
    ];

    public function getDocumentPhotoUrlAttribute(): string
    {
        return asset('storage/' . $this->document_photo);
    }

    public function getFullPhoneAttribute(): string
    {
        return $this->country_code . $this->phone_number;
    }
}
