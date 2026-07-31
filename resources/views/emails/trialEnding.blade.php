@extends('emails.layout')

@section('title')
Your {{ $product }} Free Trial Is Ending Soon - Nursedive
@endsection

@section('preheader')
Your {{ $product }} free trial is ending soon. Upgrade to keep full access to your Nursedive tools.
@endsection

@section('heading')
Your {{ $product }} Trial Is Ending Soon
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        We hope you have enjoyed exploring <strong>Nursedive</strong> and seeing how the platform can support your exam
        preparation.
    </p>

    <p style="margin:0 0 18px;">
        Your <strong>{{ $product }} free trial</strong> is ending soon. Upgrade before it ends to keep access to practice
        exams, tutor reviews, detailed reports, and your progress history.
    </p>

    @include('emails.partials.button', ['href' => 'https://app.nursedive.com/subscription', 'label' => 'Upgrade Now'])

    <p style="margin:0 0 18px;">
        Upgrading keeps your study progress in place and helps you continue preparing with confidence.
    </p>

    <p style="margin:28px 0 0;">
        Stay focused. Success is closer than you think.<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
