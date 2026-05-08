<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name'      => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-]+$/u'],
            'email'          => ['required', 'email', 'unique:patients,email', 'max:255'],
            'country_code'   => ['required', 'string', 'max:10', 'regex:/^\+\d{1,4}$/'],
            'phone_number'   => ['required', 'string', 'max:20', 'regex:/^\d{6,15}$/'],
            'document_photo' => ['required', 'file', 'mimes:jpg,jpeg', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required'      => 'Full name is required.',
            'full_name.regex'         => 'Full name must contain only letters and spaces.',
            'email.required'          => 'Email address is required.',
            'email.email'             => 'Please provide a valid email address.',
            'email.unique'            => 'This email address is already registered.',
            'country_code.required'   => 'Country code is required.',
            'country_code.regex'      => 'Country code must be in format +XX (e.g. +598).',
            'phone_number.required'   => 'Phone number is required.',
            'phone_number.regex'      => 'Phone number must contain only digits (6–15 digits).',
            'document_photo.required' => 'Document photo is required.',
            'document_photo.mimes'    => 'Document photo must be a JPG image.',
            'document_photo.max'      => 'Document photo must not exceed 10MB.',
        ];
    }
}
