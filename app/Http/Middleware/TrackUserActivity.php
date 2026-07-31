<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TrackUserActivity
{
    private const UPDATE_INTERVAL_MINUTES = 5;

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $user = $request->user();
        if (! $user) {
            return $response;
        }

        $now = now();
        $lastSeenAt = $user->last_seen_at
            ? Carbon::parse($user->last_seen_at)
            : null;

        if ($lastSeenAt && $lastSeenAt->gt($now->copy()->subMinutes(self::UPDATE_INTERVAL_MINUTES))) {
            return $response;
        }

        DB::table('users')
            ->where('id', $user->getKey())
            ->update(['last_seen_at' => $now]);

        $user->setAttribute('last_seen_at', $now);

        return $response;
    }
}
