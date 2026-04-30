<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Define the paths that should be accessible via CORS
    'paths' => ['api/*', 'sanctum/csrf-cookie', '*','http://127.0.0.1:8000'],

    // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    'allowed_methods' => ['*'],

    // Allow requests from all origins
    'allowed_origins' => ['*'],

    // No specific patterns for origins
    'allowed_origins_patterns' => [],

    // Allow all headers in the requests
    'allowed_headers' => ['*'],

    // No headers to be exposed
    'exposed_headers' => [],

    // No max age for the preflight request
    'max_age' => 0,

    // Indicate that credentials are not supported
    'supports_credentials' => false,
];
