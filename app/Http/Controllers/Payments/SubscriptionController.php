<?php

namespace App\Http\Controllers\Payments;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Traits\ManageSubscriptions;
use App\Models\Payment;
use App\Models\Plan;
use App\Models\User;
use App\Models\UserSubscription;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    use ManageSubscriptions;

    public function checkAccess(Request $request)
    {
        $user = $request->user();
        $paymentId = $request->query('payment_id');

        // Find the payment record
        $payment = $paymentId ? Payment::find($paymentId) : null;
        if ($payment && $payment->user_id !== $user->id && !$user->isAdmin()) {
            return $this->ResError('Unauthorized', 403);
        }

        // Handle subscriptions (assuming User hasOne UserSubscription)
        $subscriptionRecord = $user->subscription()->first();

        $subscriptions = [];
        if ($subscriptionRecord) {
            $subscriptions = is_string($subscriptionRecord->subscriptions)
                ? json_decode($subscriptionRecord->subscriptions, true)
                : $subscriptionRecord->subscriptions;
        }

        return $this->ResSuccess([
            'subscriptions'  => $subscriptions,
            'payment_status' => $payment->status ?? '',
            'plan'           => $payment->plan ?? null,
        ]);
    }

    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'product_code' => 'sometimes|string|max:50',
            'user_id' => 'sometimes|integer|exists:users,id',
        ]);

        $plan = Plan::findOrFail($data['plan_id']);

        return $this->activatePlanForRequest(
            $request,
            $plan,
            $data['product_code'] ?? $plan->product_code,
            $data['user_id'] ?? null
        );
    }

    public function renew(Request $request, $id)
    {
        $data = $request->validate([
            'product_code' => 'sometimes|string|max:50',
            'user_id' => 'sometimes|integer|exists:users,id',
        ]);

        $plan = Plan::findOrFail($id);

        return $this->activatePlanForRequest(
            $request,
            $plan,
            $data['product_code'] ?? $plan->product_code,
            $data['user_id'] ?? null
        );
    }

    public function cancel(Request $request, $id)
    {
        $data = $request->validate([
            'product_code' => 'required|string|max:50',
        ]);

        $actor = $request->user();
        $subscription = UserSubscription::findOrFail($id);

        if (!$actor->isAdmin() && $subscription->user_id !== $actor->id) {
            return $this->ResError('Unauthorized', 403);
        }

        $subscriptions = $this->normalizeSubscriptions($subscription->subscriptions);
        $productCode = $data['product_code'];

        if (!isset($subscriptions[$productCode])) {
            return $this->ResError('Subscription product not found', 404);
        }

        $expiredAt = Carbon::yesterday()->toDateString();
        foreach ($subscriptions[$productCode] as $index => $plan) {
            $subscriptions[$productCode][$index]['expires'] = $expiredAt;
        }

        $subscription->subscriptions = $subscriptions;
        $subscription->save();

        return $this->ResSuccess([
            'subscriptions' => $subscriptions,
            'message' => 'Subscription access cancelled.',
        ]);
    }

    private function activatePlanForRequest(Request $request, Plan $plan, string $productCode, ?int $targetUserId = null)
    {
        $actor = $request->user();

        if ($targetUserId && !$actor->isAdmin()) {
            return $this->ResError('Only admins can manage another user subscription.', 403);
        }

        if (!$this->canDirectlyActivate($actor, $plan)) {
            return $this->ResError('Paid plans must be activated through checkout.', 403);
        }

        $targetUser = $targetUserId ? User::findOrFail($targetUserId) : $actor;
        $subscriptions = $this->createOrUpdateSubscription($targetUser, $plan, $productCode);

        return $this->ResSuccess([
            'subscriptions' => $subscriptions,
            'message' => $plan->name === 'trial' ? 'Trial access activated.' : 'Subscription access activated.',
        ]);
    }

    private function canDirectlyActivate(User $actor, Plan $plan): bool
    {
        return $actor->isAdmin()
            || $plan->name === 'trial'
            || (float) $plan->price <= 0;
    }

    private function normalizeSubscriptions($subscriptions): array
    {
        if (is_string($subscriptions)) {
            return json_decode($subscriptions, true) ?: [];
        }

        return $subscriptions ?: [];
    }
}
