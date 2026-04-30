<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class UserSubscription extends Model
{
    protected $fillable = [
        'user_id',
        'subscriptions',  // JSON column
    ];

    protected $casts = [
        'subscriptions' => 'array', // automatically cast JSON to array
    ];

    /**
     * The user owning this subscription.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a product has any active plan.
     *
     * @param string $product
     * @return bool
     */
    public function isProductActive(string $product): bool
    {
        if (!isset($this->subscriptions[$product])) {
            return false;
        }

        foreach ($this->subscriptions[$product] as $plan) {
            if (Carbon::parse($plan['expires'])->isFuture()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the active plan(s) for a product.
     *
     * @param string $product
     * @return array
     */
    public function activePlans(string $product): array
    {
        if (!isset($this->subscriptions[$product])) {
            return [];
        }

        return array_filter($this->subscriptions[$product], function ($plan) {
            return Carbon::parse($plan['expires'])->isFuture();
        });
    }
}
