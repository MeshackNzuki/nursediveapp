<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class subscriptionExpired extends Notification // implements ShouldQueue
{
    // use Queueable;

    protected $user;
    protected $product;
    protected $expires;


    /**
     * Create a new notification instance.
     */
    public function __construct($user, $product, $expires)
    {
        $this->user = $user;
        $this->product = $product;
        $this->expires = $expires;
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
    public function toMail(object $notifiable): MailMessage
    { {
            return (new MailMessage)
                ->subject('Your Subscription Has Expired - Teatavia!')
                ->view('emails.subscriptionExpired', [
                    'user' => $this->user,
                    'product' => ucfirst($this->product),
                    'expired_date' => $this->expires,
                ]);
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'product' => $this->product,
            'expired_date' => $this->expires,
        ];
    }
}