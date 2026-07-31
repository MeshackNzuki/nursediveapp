@extends('emails.layout')

@section('title', 'Verify Your Email - Nursedive')

@section('preheader')
Verify your email address to finish setting up your Nursedive account.
@endsection

@section('heading')
Verify Your Email
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        Thanks for joining <strong>Nursedive</strong>. Please verify your email address to finish setting up your
        account and keep it secure.
    </p>

    @include('emails.partials.button', ['href' => $url, 'label' => 'Verify Email'])

    <p style="margin:0 0 18px;">
        This link expires in <strong>60 minutes</strong>. After verifying, sign out and back in on any other devices to
        refresh your session.
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
        Warm regards,<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
