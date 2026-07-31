@extends('emails.layout')

@section('title', 'Reset Your Password - Nursedive')

@section('preheader')
Reset your Nursedive password. This secure link expires in {{ config('auth.passwords.users.expire', 60) }} minutes.
@endsection

@section('heading')
Reset Your Password
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hi <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        We received a request to reset the password for your <strong>Nursedive</strong> account.
    </p>

    <p style="margin:0 0 18px;">
        Use the button below to create a new password.
    </p>

    @include('emails.partials.button', ['href' => $url, 'label' => 'Reset Password'])

    <p style="margin:0 0 18px;">
        This link expires in <strong>{{ config('auth.passwords.users.expire', 60) }} minutes</strong>. If you did not
        request this change, you can safely ignore this email. Your current password will not change.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="margin:24px 0 0; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <tr>
            <td style="padding:16px;">
                <p style="margin:0 0 8px; color:#64748b; font-size:14px; line-height:1.5;">
                    If the button does not work, copy and paste this link into your browser:
                </p>
                <p style="margin:0; word-break:break-all; font-size:14px; line-height:1.5;">
                    <a href="{{ $url }}" style="color:#172554; text-decoration:underline;">{{ $url }}</a>
                </p>
            </td>
        </tr>
    </table>

    <p style="margin:28px 0 0;">
        Stay safe,<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
