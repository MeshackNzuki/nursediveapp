<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Password Reset - Nursedive</title>
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
                                Reset Your Password
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px; text-align:left; font-size:16px; line-height:1.6; color:#444;">
                            <p>Hey <strong>{{ explode(' ', trim($user->name))[0] }}</strong>,</p>
                            <p>We received a request to reset your password for your <strong>Nursedive</strong> account.
                            </p>

                            <p style="text-align:center; margin:40px 0;">
                                <a href="{!! $url !!}"
                                    style="background:#172554; color:#ffffff; text-decoration:none; 
                                          padding:14px 28px; border-radius:25px; font-size:16px; font-weight:bold;">
                                    Reset Password
                                </a>
                            </p>

                            <p>If the button above doesn’t work, you can copy and paste this link into your browser:</p>
                            <p style="word-break:break-all; color:#172554;">
                                {!! $url !!}
                            </p>

                            <p style="margin-top:30px;">
                                This link will expire in <strong>60 minutes</strong>.
                                <br>If you didn’t request this, please ignore this email.
                            </p>

                            <p style="margin-top:30px;">
                                Stay safe,<br>
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
