@extends('emails.layout')

@section('title', 'Honest Question - How Is Nursedive Treating You?')

@section('preheader')
A quick check-in from Nursedive about your first few days.
@endsection

@section('heading')
How Is Nursedive Treating You?
@endsection

@section('content')
    @php($firstName = strtok(trim($user->name ?? ''), ' ') ?: 'there')

    <p style="margin:0 0 18px;">Hello <strong>{{ $firstName }}</strong>,</p>

    <p style="margin:0 0 18px;">
        It has been a few days since you joined <strong>Nursedive</strong>, and I wanted to check in. How is everything
        going so far?
    </p>

    <p style="margin:0 0 18px;">
        Have you tried any practice exams or explored your study dashboard yet? If not, you can jump back in anytime and
        pick up where you left off.
    </p>

    @include('emails.partials.button', ['href' => 'https://app.nursedive.com/', 'label' => 'Continue Studying'])

    <p style="margin:0 0 18px;">
        Consistency makes a real difference. Even one short practice session a day can help you build confidence.
    </p>

    <p style="margin:0 0 18px;">
        I would also love your feedback. Was it easy to get started? Is anything confusing, or is there something that
        would make Nursedive better for you? You can reply directly to this email.
    </p>

    <p style="margin:28px 0 0;">
        Wishing you confidence and calm as you study,<br>
        <strong>Ryan from Nursedive</strong>
    </p>
@endsection
