@extends('emails.layout')

@section('title')
Your {{ $product }} Subscription Has Expired - Nursedive
@endsection

@section('preheader')
Your {{ $product }} subscription has expired. Renew to restore full access.
@endsection

@section('heading')
Your Subscription Has Expired
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        Your <strong>Nursedive {{ $product }}</strong> subscription expired on
        <strong>{{ $expired_date }}</strong>.
    </p>

    <p style="margin:0 0 18px;">
        Renew now to restore full access and continue tracking your study progress.
    </p>

    @include('emails.partials.button', ['href' => $actionUrl ?? 'https://app.nursedive.com/subscription', 'label' => 'Renew Subscription'])

    <p style="margin:28px 0 0;">
        We are ready when you are.<br>
        <strong>The Nursedive Team</strong>
    </p>
@endsection
