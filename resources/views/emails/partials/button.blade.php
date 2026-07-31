@php
    $buttonHref = $href ?? '#';
    $buttonLabel = $label ?? 'Open Nursedive';
@endphp

<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:32px auto;">
    <tr>
        <td align="center" bgcolor="#172554" style="border-radius:999px;">
            <a href="{{ $buttonHref }}" target="_blank" class="email-button"
                style="display:inline-block; padding:14px 30px; border:1px solid #172554; border-radius:999px; background:#172554; color:#ffffff; font-size:16px; line-height:1.2; font-weight:700; text-decoration:none;">
                {{ $buttonLabel }}
            </a>
        </td>
    </tr>
</table>
