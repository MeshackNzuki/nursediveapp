<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Nursedive')</title>
    <style>
        @media only screen and (max-width: 640px) {
            .email-shell {
                width: 100% !important;
            }

            .email-header {
                padding: 24px 18px !important;
            }

            .email-body {
                padding: 28px 20px !important;
            }

            .email-title {
                font-size: 23px !important;
                line-height: 1.25 !important;
            }

            .email-button {
                display: block !important;
            }
        }
    </style>
</head>

<body
    style="margin:0; padding:0; width:100%; background:#f3f7fb; color:#334155; font-family:Arial, Helvetica, sans-serif; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; font-size:1px; line-height:1px;">
        @yield('preheader')
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f7fb;">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" class="email-shell"
                    style="width:600px; max-width:600px; background:#ffffff; border:1px solid #dbeafe; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(15,23,42,0.08);">
                    <tr>
                        <td align="center" class="email-header" style="background:#172554; padding:30px 28px;">
                            <img src="https://app.nursedive.com/assets/favicon.png" alt="Nursedive" width="56"
                                height="56" style="display:block; width:56px; height:56px; border:0; margin:0 0 14px;">
                            <h1 class="email-title"
                                style="margin:0; color:#ffffff; font-size:26px; line-height:1.25; font-weight:700; letter-spacing:0;">
                                @yield('heading')
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td class="email-body"
                            style="padding:34px 34px 32px; color:#334155; font-size:16px; line-height:1.65;">
                            @yield('content')
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="background:#f8fafc; padding:22px 24px; border-top:1px solid #e2e8f0;">
                            <p style="margin:0 0 6px; color:#64748b; font-size:12px; line-height:1.5;">
                                &copy; {{ date('Y') }} Nursedive. All rights reserved.
                            </p>
                            <p style="margin:0; color:#64748b; font-size:12px; line-height:1.5;">
                                <a href="https://www.nursedive.com/"
                                    style="color:#172554; font-weight:700; text-decoration:none;">Visit Nursedive</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
