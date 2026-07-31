@extends('emails.layout')

@section('title')
Your {{ $product }} Trial Has Ended - Nursedive
@endsection

@section('preheader')
Your {{ $product }} trial has ended, but you can upgrade any time to keep full access.
@endsection

@section('heading')
Your Trial Has Ended
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        Your <strong>Nursedive {{ $product }}</strong> trial ended on <strong>{{ $expired_date }}</strong>.
    </p>

    <p style="margin:0 0 18px;">
        You can continue with Nursedive Basic, or upgrade to a premium plan at any time to keep full access to your practice tools,
        reports, and progress history.
    </p>

    @include('emails.partials.button', ['href' => 'https://app.nursedive.com/subscription', 'label' => 'Upgrade Plan'])

    <p style="margin:28px 0 0;">
        We are here whenever you are ready to keep going.<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
