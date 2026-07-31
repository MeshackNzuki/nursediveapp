@extends('emails.layout')

@section('title', 'Payment Receipt - Nursedive')

@section('preheader')
Your Nursedive payment receipt is ready.
@endsection

@section('heading')
Payment Receipt
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 20px;">
        Thank you for your payment. Here are the details for your recent <strong>Nursedive</strong> transaction.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="margin:22px 0 26px; border-collapse:separate; border-spacing:0; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden;">
        <tr>
            <td style="padding:12px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#475569; width:42%;">
                <strong>Receipt #</strong>
            </td>
            <td style="padding:12px 14px; border-bottom:1px solid #e2e8f0; color:#334155;">
                {{ $payment['receipt_number'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td style="padding:12px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#475569;">
                <strong>Product</strong>
            </td>
            <td style="padding:12px 14px; border-bottom:1px solid #e2e8f0; color:#334155;">
                {{ strtoupper($payment['product_code'] ?? '') }}
            </td>
        </tr>
        <tr>
            <td style="padding:12px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#475569;">
                <strong>Plan</strong>
            </td>
            <td style="padding:12px 14px; border-bottom:1px solid #e2e8f0; color:#334155;">
                {{ $payment['plan_name'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td style="padding:12px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#475569;">
                <strong>Amount</strong>
            </td>
            <td style="padding:12px 14px; border-bottom:1px solid #e2e8f0; color:#334155;">
                ${{ number_format((float) ($payment['amount'] ?? 0), 2) }}
            </td>
        </tr>
        <tr>
            <td style="padding:12px 14px; background:#f8fafc; border-bottom:1px solid #e2e8f0; color:#475569;">
                <strong>Payment Date</strong>
            </td>
            <td style="padding:12px 14px; border-bottom:1px solid #e2e8f0; color:#334155;">
                {{ $payment['date'] ?? '' }}
            </td>
        </tr>
        <tr>
            <td style="padding:12px 14px; background:#f8fafc; color:#475569;">
                <strong>Expires</strong>
            </td>
            <td style="padding:12px 14px; color:#334155;">
                {{ $payment['expires'] ?? '' }}
            </td>
        </tr>
    </table>

    <p style="margin:0 0 18px;">
        Your subscription is now active. You can return to your dashboard and keep learning right away.
    </p>

    @include('emails.partials.button', ['href' => 'https://app.nursedive.com/', 'label' => 'Go to Dashboard'])

    <p style="margin:28px 0 0;">
        Thanks again for choosing Nursedive.<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
