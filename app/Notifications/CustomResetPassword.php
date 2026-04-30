<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CustomResetPassword extends Notification // implements ShouldQueue
{
    //use Queueable;

    protected $query;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $query)
    {
        $this->query = $query;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable)
    {
        $url = 'https://app.nursedive.com/reset-password?' . $this->query;

        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Reset Your Password - Nursedive')
            ->view('emails.reset-password', [
                'user' => $notifiable,
                'url'  => $url,
            ]);
    }


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'token' => $this->query,
        ];
    }
}
