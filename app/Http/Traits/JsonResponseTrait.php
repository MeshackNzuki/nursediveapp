<?php

namespace App\Http\Traits;

trait JsonResponseTrait
{
    /**
     * Respond with a JSON success message.
     *
     * @param mixed $data
     * @param int $status
     * @param array $headers
     * @return \Illuminate\Http\JsonResponse
     */
    public function ResSuccess($data = null, $status = 200, $headers = [])
    {
        $responseData = [
            'success' => true,
            'data' => $data,
        ];
        
        return response()->json($responseData, $status, $headers);
    }

    /**
     * Respond with a JSON error message.
     *
     * @param string $message
     * @param int $status
     * @param array $headers
     * @return \Illuminate\Http\JsonResponse
     */
    public function ResError($message = 'An error occurred', $status = 400, $headers = [])
    {
        $responseData = [
            'success' => false,
            'error' => $message,
        ];

        return response()->json($responseData, $status, $headers);
    }
}
