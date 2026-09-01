<?php

namespace App\Http\Controllers\Payments;

use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlanController extends Controller
{
    private function canManagePlans(Request $request): bool
    {
        return (bool) $request->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function index()
    {
        return $this->ResSuccess(Plan::all());
    }

    public function store(Request $request)
    {
        if (!$this->canManagePlans($request)) {
            return $this->ResError('Unauthorized', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'product_code' => 'required|string|max:50',
            'duration_days' => 'required|integer|min:1',
        ]);

        return $this->ResSuccess(Plan::create($validated), 201);
    }

    public function show(Plan $plan)
    {

        return $this->ResSuccess($plan);
    }

    public function update(Request $request, Plan $plan)
    {
        if (!$this->canManagePlans($request)) {
            return $this->ResError('Unauthorized', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'product_code' => 'sometimes|string|max:50',
            'duration_days' => 'sometimes|integer|min:1',
        ]);

        $plan->update($validated);
        return $this->ResSuccess($plan);
    }

    public function destroy(Request $request, Plan $plan)
    {
        if (!$this->canManagePlans($request)) {
            return $this->ResError('Unauthorized', 403);
        }

        $plan->delete();
        return $this->ResSuccess('');
    }
}
