<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Welcome to Nursedive</title>
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
                            <h1 style="margin:0; font-size:28px; color:#ffffff; font-weight:bold;">
                                Welcome to Nursedive 💙
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px; text-align:left; font-size:16px; line-height:1.6; color:#444;">

                            <p>Hello <strong>{{ explode(' ', trim($user->name))[0] }}</strong>,</p>

                            <p>We’re so excited to welcome you to <strong>Nursedive</strong> — your trusted partner in
                                nursing education and exam preparation.</p>

                            <p>
                                Whether you’re preparing for the <strong>TEAS, Nursing Assessment, NCLEX</strong>,
                                sharpening your clinical
                                knowledge,
                                or building confidence for your nursing career, you now have access to tools and
                                resources designed to help you succeed.
                            </p>

                            <p style="text-align:center; margin:40px 0;">
                                <a href="https://app.nursedive.com/"
                                    style="background:#172554; color:#ffffff; text-decoration:none; 
                                          padding:14px 28px; border-radius:25px; font-size:16px; font-weight:bold;">
                                    Start Learning
                                </a>
                            </p>

                            <p>
                                Nursing is more than a profession — it’s a calling.
                                At Nursedive, we’re honored to support your journey with high-quality practice
                                questions,
                                detailed explanations,
                                and progress tracking to help you reach your goals.
                            </p>

                            <p style="margin-top:30px;">
                                Wishing you success and confidence every step of the way,
                                <br><strong>The Nursedive Team</strong>
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
