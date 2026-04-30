<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Payment Receipt - Nursedive</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#eff6ff; color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#172554; padding:20px;">
                            <img src="https://app.nursedive.com/assets/favicon.png" alt="Nursedive Logo" width="60"
                                height="60" style="display:block; margin-bottom:15px;">
                            <h1 style="margin:0; font-size:26px; color:#ffffff; font-weight:bold;">
                                Payment Receipt
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px; font-size:16px; line-height:1.6; color:#444;">
                            <p>Hey <strong>{{ explode(' ', trim($user->name))[0] }}</strong>,</p>


                            <p>
                                Thank you for your payment! Here are the details of your recent transaction with
                                <strong>Nursedive</strong>.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="margin:20px 0; border-collapse:collapse;">
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Receipt
                                            #:</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;">
                                        {{ $payment['receipt_number'] }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Product:</strong>
                                    </td>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;">
                                        {{ strtoupper($payment['product_code']) }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Plan:</strong>
                                    </td>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;">
                                        {{ $payment['plan_name'] }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Amount:</strong>
                                    </td>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;">
                                        ${{ number_format($payment['amount'], 2) }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Payment
                                            Date:</strong></td>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;">{{ $payment['date'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;"><strong>Expires:</strong>
                                    </td>
                                    <td style="padding:8px; border-bottom:1px solid #e5e7eb;">{{ $payment['expires'] }}
                                    </td>
                                </tr>
                            </table>

                            <p style="margin-top:20px;">
                                We’re excited to support you in your journey. Your subscription is now active — you can
                                start learning right away.
                            </p>

                            <p style="text-align:center; margin:40px 0;">
                                <a href="https://app.nursedive.com/"
                                    style="background:#172554; color:#ffffff; text-decoration:none; 
                                          padding:14px 28px; border-radius:25px; font-size:16px; font-weight:bold;">
                                    Go to Dashboard
                                </a>
                            </p>

                            <p style="margin-top:30px;">
                                Thanks again for choosing Nursedive. We wish you success and confidence every step of
                                the
                                way!
                            </p>

                            <p>
                                <strong>The Nursedive Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f1f5f9; padding:20px; font-size:12px; color:#777;">
                            <p style="margin:0;">© {{ date('Y') }} Nursedive. All rights reserved.</p>
                            <p style="margin:0;">
                                <a href="https://www.nursedive.com/" style="color:#172554; text-decoration:none;">Visit
                                    Nursedive</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
