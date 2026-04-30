<?php

namespace App\Http\Controllers\Payments;

use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlanController extends Controller
{
    public function index()
    {
        return $this->ResSuccess(Plan::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'product_codes' => 'required|array',
            'duration_days' => 'required|integer|min:1',
        ]);
        return Plan::create($validated);
    }

    public function show(Plan $plan)
    {

        return $this->ResSuccess($plan);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'product_codes' => 'sometimes|array',
            'duration_days' => 'sometimes|integer|min:1',
        ]);

        $plan->update($validated);
        return $this->ResSuccess($plan);
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return $this->ResSuccess('');
    }
}
