<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Notifications\PatientRegistered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PatientRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private function validData(): array
    {
        return [
            'full_name'      => 'Jane Doe',
            'email'          => 'jane@example.com',
            'country_code'   => '+1',
            'phone_number'   => '5551234567',
            'document_photo' => UploadedFile::fake()->image('document.jpg'),
        ];
    }

    public function test_stores_patient_and_returns_201(): void
    {
        Storage::fake('public');
        Notification::fake();

        $this->post('/api/v1/patients', $this->validData())
            ->assertStatus(201)
            ->assertJsonStructure([
                'id', 'full_name', 'email', 'country_code',
                'phone_number', 'full_phone', 'document_photo_url', 'created_at',
            ])
            ->assertJsonFragment(['email' => 'jane@example.com', 'full_phone' => '+15551234567']);

        $this->assertDatabaseHas('patients', ['email' => 'jane@example.com']);
    }

    public function test_dispatches_registration_notification(): void
    {
        Storage::fake('public');
        Notification::fake();

        $this->post('/api/v1/patients', $this->validData());

        Notification::assertSentOnDemand(PatientRegistered::class);
    }

    public function test_stores_document_photo_on_disk(): void
    {
        Storage::fake('public');
        Notification::fake();

        $this->post('/api/v1/patients', $this->validData());

        $patient = Patient::first();
        Storage::disk('public')->assertExists($patient->document_photo);
    }

    public function test_returns_patients_list(): void
    {
        Storage::fake('public');
        Notification::fake();

        $this->post('/api/v1/patients', $this->validData());

        $this->getJson('/api/v1/patients')
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['email' => 'jane@example.com']);
    }

    public function test_rejects_duplicate_email(): void
    {
        Storage::fake('public');
        Notification::fake();

        $this->post('/api/v1/patients', $this->validData());

        $this->post('/api/v1/patients', array_merge($this->validData(), [
            'document_photo' => UploadedFile::fake()->image('document2.jpg'),
        ]))->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_requires_full_name(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        unset($data['full_name']);

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['full_name']);
    }

    public function test_requires_email(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        unset($data['email']);

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_requires_country_code(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        unset($data['country_code']);

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['country_code']);
    }

    public function test_requires_phone_number(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        unset($data['phone_number']);

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['phone_number']);
    }

    public function test_requires_document_photo(): void
    {
        $data = $this->validData();
        unset($data['document_photo']);

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['document_photo']);
    }

    public function test_validates_full_name_letters_only(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        $data['full_name'] = 'Jane123';

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['full_name']);
    }

    public function test_validates_country_code_format(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        $data['country_code'] = '001';

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['country_code']);
    }

    public function test_validates_phone_number_digits_only(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        $data['phone_number'] = 'abc123';

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['phone_number']);
    }

    public function test_rejects_non_jpg_document(): void
    {
        Storage::fake('public');

        $data = $this->validData();
        $data['document_photo'] = UploadedFile::fake()->create('document.png', 100, 'image/png');

        $this->post('/api/v1/patients', $data)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['document_photo']);
    }
}
