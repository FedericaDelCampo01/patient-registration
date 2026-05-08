<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Models\Patient;
use App\Notifications\PatientRegistered;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::latest()->get()->map(function (Patient $patient) {
            return [
                'id'                 => $patient->id,
                'full_name'          => $patient->full_name,
                'email'              => $patient->email,
                'country_code'       => $patient->country_code,
                'phone_number'       => $patient->phone_number,
                'full_phone'         => $patient->full_phone,
                'document_photo_url' => $patient->document_photo_url,
                'created_at'         => $patient->created_at,
            ];
        });

        return response()->json($patients);
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $photoPath = $request->file('document_photo')
            ->store('documents', 'public');

        $patient = Patient::create([
            'full_name'      => $request->full_name,
            'email'          => $request->email,
            'country_code'   => $request->country_code,
            'phone_number'   => $request->phone_number,
            'document_photo' => $photoPath,
        ]);

        \Notification::route('mail', $patient->email)
            ->notify(new PatientRegistered($patient));

        return response()->json([
            'id'                 => $patient->id,
            'full_name'          => $patient->full_name,
            'email'              => $patient->email,
            'country_code'       => $patient->country_code,
            'phone_number'       => $patient->phone_number,
            'full_phone'         => $patient->full_phone,
            'document_photo_url' => $patient->document_photo_url,
            'created_at'         => $patient->created_at,
        ], 201);
    }
}
