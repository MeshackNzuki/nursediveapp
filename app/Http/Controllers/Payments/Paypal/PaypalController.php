<?php

namespace App\Http\Controllers\Payments\Paypal;

use App\Http\Controllers\Controller;

class PaypalController extends Controller
{
    public function disabled()
    {
        return $this->ResError([
            'message' => 'PayPal payments are currently disabled. Please use Stripe checkout.',
        ], 410);
    }
}
