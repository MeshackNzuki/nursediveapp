<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class DailyNotificationSummary extends Notification implements ShouldQueue
{
    use Queueable;

    protected $summary;

    public function __construct(array $summary)
    {
        $this->summary = $summary;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Daily Client Notification Summary')
            ->greeting('Hello Admin,')
            ->line('Here’s a summary of today’s automated notifications:')
            ->line('')
            ->line('Date: ' . now()->toFormattedDateString())
            ->line('')
            ->line('**Subscription Notifications:**')
            ->line('- Expiring: ' . $this->summary['expiring'])
            ->line('- Expired: ' . $this->summary['expired'])
            ->line('- Trial Ending: ' . $this->summary['trial_ending'])
            ->line('- Trial Ended: ' . $this->summary['trial_ended'])
            ->line('')
            ->line('**First Engagements Sent:** ' . $this->summary['engagement'])
            ->line('')
            ->line('letsKeep Pushing')
            ->salutation('— Nursedive Mailer Bot');
    }
}