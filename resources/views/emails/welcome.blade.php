@extends('emails.layout')

@section('title', 'Welcome to Nursenex')

@section('preheader')
Your Nursenex account is ready. Start practicing with exams, explanations, and progress tools.
@endsection

@section('heading')
Welcome to Nursenex
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        Welcome to <strong>Nursenex</strong>. Your account is ready, and we are excited to help with your nursing exam
        preparation.
    </p>

    <p style="margin:0 0 18px;">
        Use your dashboard to practice for TEAS, Nursing Assessment, and NCLEX. You can also review detailed explanations
        and track your progress as you build confidence.
    </p>

    @include('emails.partials.button', ['href' => 'https://app.nursenex.com/', 'label' => 'Start Learning'])

    <p style="margin:0 0 18px;">
        Nursing takes discipline and calm focus. We built Nursenex to help you study with clarity, one focused session
        at a time.
    </p>

    <p style="margin:28px 0 0;">
        Wishing you success and confidence every step of the way,<br>
        <strong>The Nursenex Team</strong>
    </p>
@endsection
