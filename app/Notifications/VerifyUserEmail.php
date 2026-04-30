<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class VerifyUserEmail extends Notification //implements ShouldQueue
{
    //use Queueable;

    protected $query;

    public function __construct(string $query)
    {
        $this->query = $query;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable)
    {
        $url = 'https://app.nursedive.com/email-verification?' . $this->query;

        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Verify Your Email - Nursedive')
            ->view('emails.verify-email', [
                'user' => $notifiable,
                'url'  => $url,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'token' => $this->query,
        ];
    }
}
