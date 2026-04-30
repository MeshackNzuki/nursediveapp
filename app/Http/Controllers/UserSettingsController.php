<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserSettingsController extends Controller
{
    public function show(Request $request)
    {
        $record = UserSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['settings' => $this->defaultSettings()]
        );

        $settings = $this->mergeWithDefaults($record->settings ?? []);
        if ($settings !== ($record->settings ?? [])) {
            $record->settings = $settings;
            $record->save();
        }

        return $this->ResSuccess([
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'notifications' => ['sometimes', 'array'],
            'notifications.email_notifications' => ['sometimes', 'boolean'],
            'notifications.sms_alerts' => ['sometimes', 'boolean'],
            'notifications.exam_reminders' => ['sometimes', 'boolean'],
            'notifications.weekly_digest' => ['sometimes', 'boolean'],
            'notifications.marketing_updates' => ['sometimes', 'boolean'],

            'preferences' => ['sometimes', 'array'],
            'preferences.auto_save_progress' => ['sometimes', 'boolean'],
            'preferences.default_exam_mode' => ['sometimes', Rule::in(['exam', 'tutor'])],
            'preferences.show_rationales_in_tutor' => ['sometimes', 'boolean'],
            'preferences.enable_sounds' => ['sometimes', 'boolean'],
            'preferences.question_font_size' => ['sometimes', Rule::in(['compact', 'comfortable', 'large'])],
            'preferences.timezone' => ['sometimes', 'string', 'max:100'],
            'preferences.daily_reminder_time' => ['sometimes', 'date_format:H:i'],

            'security' => ['sometimes', 'array'],
            'security.login_alerts' => ['sometimes', 'boolean'],
            'security.require_verified_email' => ['sometimes', 'boolean'],
            'security.session_timeout_minutes' => ['sometimes', 'integer', 'min:15', 'max:240'],

            'appearance' => ['sometimes', 'array'],
            'appearance.theme' => ['sometimes', 'string', 'max:50'],
            'appearance.font' => ['sometimes', 'string', 'max:50'],
        ]);

        $record = UserSetting::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['settings' => $this->defaultSettings()]
        );

        $current = is_array($record->settings) ? $record->settings : [];
        $incoming = [
            'notifications' => $validated['notifications'] ?? [],
            'preferences' => $validated['preferences'] ?? [],
            'security' => $validated['security'] ?? [],
            'appearance' => $validated['appearance'] ?? [],
        ];

        $next = $this->mergeWithDefaults(array_replace_recursive($current, $incoming));
        $record->settings = $next;
        $record->save();

        return $this->ResSuccess([
            'message' => 'Settings updated successfully.',
            'settings' => $next,
        ]);
    }

    public function reset(Request $request)
    {
        $record = UserSetting::updateOrCreate(
            ['user_id' => $request->user()->id],
            ['settings' => $this->defaultSettings()]
        );

        return $this->ResSuccess([
            'message' => 'Settings reset to defaults.',
            'settings' => $record->settings,
        ]);
    }

    private function mergeWithDefaults(array $settings): array
    {
        $defaults = $this->defaultSettings();

        return [
            'notifications' => array_merge($defaults['notifications'], (array) ($settings['notifications'] ?? [])),
            'preferences' => array_merge($defaults['preferences'], (array) ($settings['preferences'] ?? [])),
            'security' => array_merge($defaults['security'], (array) ($settings['security'] ?? [])),
            'appearance' => array_merge($defaults['appearance'], (array) ($settings['appearance'] ?? [])),
        ];
    }

    private function defaultSettings(): array
    {
        return [
            'notifications' => [
                'email_notifications' => true,
                'sms_alerts' => false,
                'exam_reminders' => true,
                'weekly_digest' => true,
                'marketing_updates' => false,
            ],
            'preferences' => [
                'auto_save_progress' => true,
                'default_exam_mode' => 'exam',
                'show_rationales_in_tutor' => true,
                'enable_sounds' => true,
                'question_font_size' => 'comfortable',
                'timezone' => 'Africa/Nairobi',
                'daily_reminder_time' => '19:00',
            ],
            'security' => [
                'login_alerts' => true,
                'require_verified_email' => true,
                'session_timeout_minutes' => 60,
            ],
            'appearance' => [
                'theme' => 'Light',
                'font' => 'Exo',
            ],
        ];
    }
}

