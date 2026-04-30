<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PaymentReceipt extends Notification // implements ShouldQueue
{
    // use Queueable;

    protected $payment;

    /**
     * Create a new notification instance.
     */
    public function __construct(array $payment)
    {
        $this->payment = $payment;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Your Payment Receipt - Nursedive')
            ->view('emails.receipt', [
                'user'    => $notifiable,
                'payment' => $this->payment,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payment' => $this->payment,
        ];
    }
}
