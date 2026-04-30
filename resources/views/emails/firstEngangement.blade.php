<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Honest Question — How’s Nursedive Treating You?</title>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f8fafc; color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; padding:40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#172554; padding:20px;">
                            <img src="https://app.nursedive.com/assets/favicon.png" alt="Nursedive Logo" width="60"
                                height="60" style="display:block; margin-bottom:15px;">
                            <h1 style="margin:0; font-size:24px; color:#ffffff; font-weight:bold;">
                                Honest Question — How’s Nursedive Treating You?
                            </h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px; font-size:16px; line-height:1.6; color:#444;">
                            <p>Hey <strong>{{ explode(' ', trim($user->name))[0] }}</strong>,</p>

                            <p>It’s been a few days since you joined <strong>Nursedive</strong>, and I just wanted to
                                check in personally — how’s everything going so far?</p>

                            <p>
                                Have you tried any of the practice exams or explored your study dashboard yet?
                                If not, no worries — you can jump right back in and pick up where you left off anytime.
                            </p>

                            <p style="text-align:center; margin:35px 0;">
                                <a href="https://app.nursedive.com/"
                                    style="background:#172554; color:#ffffff; text-decoration:none;
                                          padding:14px 30px; border-radius:25px; font-size:16px; font-weight:bold;">
                                    Continue Studying
                                </a>
                            </p>

                            <p>
                                Remember, the best way to make progress is with consistency.
                                Even one short practice session a day makes a huge difference!
                            </p>

                            <p>
                                I’d also love to hear from you — was it easy to get started?
                                Anything confusing or that could make your experience better?
                                You can just hit “reply” to this email and share your thoughts — I read every message.
                            </p>

                            <p style="margin-top:30px;">
                                Wishing you confidence and calm as you study,<br>
                                <strong>Emma from Nursedive 💙</strong>
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
