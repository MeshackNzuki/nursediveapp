<?php

use Illuminate\Support\Facades\Route;

// Your app's API/web routes go here...

// Vue entry point (must be last)
Route::get('/{any}', function () {
    return view('VueEntry');
})->where('any', '^(?!storage).*');