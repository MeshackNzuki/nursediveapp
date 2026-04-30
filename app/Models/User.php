<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Carbon;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'verified',
        'product_codes',

        // Notification flags
        'expired_sent',
        'expiring_sent',
        'trial_ending_sent',
        'trial_ended_sent',
        'first_engagement_sent',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function subscription()
    {
        return $this->hasOne(UserSubscription::class);
    }

    public function settings()
    {
        return $this->hasOne(UserSetting::class);
    }

    /**
     * Check if user has an active plan for a product.
     */
    public function hasActivePlan(string $product): bool
    {
        foreach ($this->subscriptions as $sub) {
            if ($sub->isProductActive($product)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get all active plans for a product.
     */
    public function activePlans(string $product): array
    {
        $plans = [];
        foreach ($this->subscriptions as $sub) {
            $plans = array_merge($plans, $sub->activePlans($product));
        }
        return $plans;
    }

    /**
     * Add a plan to a product for the user.
     */
    public function addPlan(string $product, int $planId, string $expires, ?string $paymentId = null): void
    {
        $subscription = $this->subscriptions()->firstOrCreate([], [
            'subscriptions' => json_encode([$product => [
                [
                    'plan_id'    => $planId,
                    'expires'    => $expires,
                    'payment_id' => $paymentId
                ]
            ]]),
        ]);

        $subs = $subscription->subscriptions;
        if (!isset($subs[$product])) {
            $subs[$product] = [];
        }
        $subs[$product][] = [
            'plan_id'    => $planId,
            'expires'    => $expires,
            'payment_id' => $paymentId
        ];
        $subscription->subscriptions = $subs;
        $subscription->save();
    }
}
