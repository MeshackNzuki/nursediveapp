<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Your Nursedive Subscription Has Expired</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#eff6ff; color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

                    <tr>
                        <td align="center" style="background:#172554; padding:20px;">
                            <img src="https://app.nursedive.com/assets/favicon.png" width="60" height="60"
                                alt="Nursedive Logo" style="display:block; margin-bottom:15px;">
                            <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:bold;">
                                Your Subscription Has Expired
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:30px; font-size:16px; line-height:1.6; color:#444;">
                            <p>Dear <strong>{{ explode(' ', trim($user->name))[0] }}</strong>,</p>


                            <p>Your <strong>Nursedive {{ $product }}</strong> subscription expired on
                                <strong>{{ $expired_date }}</strong>.
                            </p>

                            <p>You no longer have access to premium exams and reports — renew now to continue your
                                progress without losing your history.</p>

                            <p style="text-align:center; margin:30px 0;">
                                <a href="https://app.nursedive.com/subscription"
                                    style="background:#172554; color:#fff; text-decoration:none; 
                                    padding:12px 26px; border-radius:25px; font-size:15px; font-weight:bold;">
                                    Renew Subscription
                                </a>
                            </p>

                            <p><strong>The Nursedive Team</strong></p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="background:#f1f5f9; padding:15px; font-size:12px; color:#777;">
                            © {{ date('Y') }} Nursedive. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
