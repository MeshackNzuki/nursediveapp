<?php

namespace App\Http\Controllers\Payments;

use App\Models\Payment;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Fetch all payments for admin
     */
    public function index(Request $request)
    {
        // Only admin should see all
        if (! $request->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $payments = Payment::with(['user', 'plan'])
            ->latest()
            ->paginate(20);

        return $this->ResSuccess([
            'payments' => $payments,
        ]);
    }

    /**
     * Fetch all payments for the authenticated user
     */
    public function myPayments(Request $request)
    {
        $user = $request->user(); // Sanctum user

        $payments = Payment::with('plan')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return $this->ResSuccess([
            'payments' => $payments,
        ]);
    }

    /**
     * Fetch a specific payment by ID (admin or owner only)
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $payment = Payment::with(['user', 'plan'])->findOrFail($id);

        if (! $user->isAdmin() && $payment->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $this->ResSuccess([
            'payment' => $payment,
        ]);
    }
}
