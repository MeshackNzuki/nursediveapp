@extends('emails.layout')

@section('title')
Your {{ $product }} Subscription Is Ending Soon - Nursedive
@endsection

@section('preheader')
Your {{ $product }} subscription is ending soon. Renew to keep uninterrupted access.
@endsection

@section('heading')
Your Subscription Is Ending Soon
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        Your <strong>Nursedive {{ $product }}</strong> subscription is scheduled to end on
        <strong>{{ $expired_date }}</strong>.
    </p>

    <p style="margin:0 0 18px;">
        Renew before that date to keep uninterrupted access to your practice questions, explanations, reports, and saved
        progress.
    </p>

    @include('emails.partials.button', ['href' => 'https://app.nursedive.com/subscription', 'label' => 'Renew Subscription'])

    <p style="margin:28px 0 0;">
        Thanks for studying with Nursedive.<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
