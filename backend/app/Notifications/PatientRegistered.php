<?php

namespace App\Notifications;

use App\Models\Patient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PatientRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Patient $patient
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Registration Confirmed – Patient Registration')
            ->greeting("Hello, {$this->patient->full_name}!")
            ->line('Your registration has been successfully completed.')
            ->line("**Email:** {$this->patient->email}")
            ->line("**Phone:** {$this->patient->full_phone}")
            ->line('If you have any questions, please contact us.')
            ->salutation('The Patient Registration Team');
    }
}
