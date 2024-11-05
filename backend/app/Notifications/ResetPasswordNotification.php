<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $url;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(string $url)
    {
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        // Extract only the token part from the original URL
        $urlParts = parse_url($this->url);
        $token = isset($urlParts['query']) ? $urlParts['query'] : '';

        // Construct the final URL
        $resetUrl = 'http://localhost:4200/reset-password?' . $token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage())
            ->subject('Reset Password Notification')
            ->greeting('Hello!')
            ->line('You can use the following button to reset your password:')
            ->action('Reset your password', $resetUrl)
            ->salutation('Regards, GAD RMS');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
                //
            ];
    }
}
