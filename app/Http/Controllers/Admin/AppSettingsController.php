<?php

namespace App\Http\Controllers\Admin;

use App\Models\AppSettings;
use Illuminate\Http\Request;
use App\Models\Term;
use App\Http\Controllers\Controller;

class AppSettingsController extends Controller
{
    /**
     * Update an existing setting or create a new one if it doesn't exist.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $key
     * @return \Illuminate\Http\Response
     */
    public function updateAppSettings(Request $request, $key)
    {
        // Validate the input value
        $request->validate([
            'value' => 'required|string',  // Ensure the value is a string
        ]);

        // Check if the setting already exists in the database
        $setting = AppSettings::where('key', $key)->first();

        if ($setting) {
            // If the setting exists, update it with the new value
            $setting->update([
                'value' => $request->value
            ]);
        } else {
            // If the setting doesn't exist, create a new one with the provided key and value
            AppSettings::create([
                'key' => $key,
                'value' => $request->value
            ]);
        }

        if ($key == 'term_start_date' || $key == 'term_end_date') {

            $term = Term::first();

            $fieldToUpdate = $key == 'term_start_date' ? 'start_date' : 'end_date';

            if ($term) {
                $term->update([
                    $fieldToUpdate => $request->value,
                ]);
            } else {
                Term::create([
                    'start_date' => $key == 'term_start_date' ? $request->value : null,
                    'end_date'   => $key == 'term_end_date' ? $request->value : null,
                ]);
            }
        }

        // Return a success response
        return $this->ResSuccess(['message' => 'AppSettings updated successfully']);
    }

    /**
     * Get a specific setting by its key.
     *
     * @param  string  $key
     * @return \Illuminate\Http\Response
     */
    public function getAppSettings($key)
    {
        // Retrieve the setting value from the database
        $setting = AppSettings::where('key', $key)->first();

        // If the setting is found, return it
        if ($setting) {
            return $this->ResSuccess(['key' => $key, 'value' => $setting->value]);
        }

        // If the setting is not found, return an error response
        return $this->ResError(['message' => 'AppSettings not found'], 404);
    }

    /**
     * List all settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function listAppSettings()
    {
        // Retrieve all settings from the database
        $settings = AppSettings::all();

        // Return the settings in a JSON response
        return $this->ResSuccess($settings);
    }

    /**
     * Delete a specific setting.
     *
     * @param  string  $key
     * @return \Illuminate\Http\Response
     */
    public function deleteAppSettings($key)
    {
        // Find the setting by its key
        $setting = AppSettings::where('key', $key)->first();

        // If the setting exists, delete it
        if ($setting) {
            $setting->delete();
            return $this->ResSuccess(['message' => 'AppSettings deleted successfully']);
        }

        // If the setting is not found, return an error response
        return $this->ResError(['message' => 'AppSettings not found'], 404);
    }
}
