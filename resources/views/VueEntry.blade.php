<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Nurse Dive - Comprehensive nursing and TEAS/HESI, NCLEX exam prep platform. Discover adaptive learning tools, rich content, and expert guidance.">
    <meta name="keywords"
        content="Nurse Dive, nursing exams, TEAS/HESI prep, NCLEX, nursing school, online test prep, adaptive learning">
    <meta name="author" content="Nurse Dive Team">

    <!-- Open Graph (for sharing previews) -->
    <meta property="og:title" content="Nurse Dive | Nursing, TEAS/HESI & NCLEX Exam Prep">
    <meta property="og:description"
        content="Join thousands of students acing nursing exams with Nurse Dive. Get started today.">
    <meta property="og:image" content="https://app.nursedive.com/assets/favicon.png">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://app.nursedive.com/assets/favicon.png">

    <title>{{ env('APP_NAME', 'Nurse Dive') }}</title>

    @vite(['resources/js/main.ts'])
</head>

<body class="">
    <div id="loading" class="fixed inset-0 bg-blue-950 z-50 flex items-center justify-center">
        <div class="loader"></div>
    </div>

    <div id="app"></div>
    <script>
        // Hide loading message once Vue app is mounted
        window.addEventListener('load', function() {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';
        });
    </script>
    <script>
        // =========================
        // CONTENT PROTECT GLOBAL SCRIPT
        // =========================
        (function(window, document) {
            // =========================
            // BLUR + OVERLAY FUNCTION
            // =========================
            function screenshotBlur(message = 'Screenshot detected') {
                document.body.style.filter = 'blur(8px)';

                const overlay = document.createElement('div');
                overlay.innerText = message;
                Object.assign(overlay.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 9999,
                    fontSize: '3rem',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    transition: 'opacity 1s ease'
                });

                document.body.appendChild(overlay);

                setTimeout(() => {
                    overlay.style.opacity = '0';
                    document.body.style.filter = 'none';
                    setTimeout(() => overlay.remove(), 1000);
                }, 3000);
            }

            // =========================
            // COPY / PASTE / CUT / SELECT / RIGHT CLICK
            // =========================
            ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'dragstart'].forEach(ev => {
                document.addEventListener(ev, e => e.preventDefault());
            });

            const styleSelect = document.createElement('style');
            styleSelect.type = 'text/css';
            styleSelect.media = 'screen';
            styleSelect.innerHTML = `
            * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            }
        `;
            document.head.appendChild(styleSelect);

            // =========================
            // PRINT BLOCKING
            // =========================
            const stylePrint = document.createElement('style');
            stylePrint.type = 'text/css';
            stylePrint.media = 'print';
            stylePrint.innerHTML = 'body{display:none !important;}';
            document.head.appendChild(stylePrint);

            // =========================
            // KEYBOARD BLOCKING
            // =========================
            document.addEventListener('keydown', e => {
                const key = e.key.toLowerCase();
                if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(key)) e.preventDefault();
                if (key === 'f12') e.preventDefault();
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)) e.preventDefault();
                if ((navigator.platform.includes('iPhone') || navigator.platform.includes('iPad')) &&
                    (e.metaKey && key === 'p')) e.preventDefault();
            });

            // =========================
            // BLUR ON TAB SWITCH
            // =========================
            function blurOnTab() {
                function toBlur() {
                    document.body.style.filter = 'blur(6px)';
                }

                function toClear() {
                    document.body.style.filter = 'none';
                }
                document.addEventListener('visibilitychange', () => document.hidden ? toBlur() : toClear());
                document.addEventListener('click', toClear);
            }
            blurOnTab();

            // =========================
            // DEVTOOLS DETECTION
            // =========================


            // =========================
            // SCREENSHOT DETECTION
            // =========================
            document.addEventListener('keyup', e => {
                const k = e.key.toLowerCase();
                if (k === 'printscreen') screenshotBlur();
                if (e.metaKey && e.shiftKey && k === 's') screenshotBlur('Win+Shift+S detected');
                if ((navigator.platform.includes('iPhone') || navigator.platform.includes('iPad')) &&
                    e.metaKey && e.shiftKey && k === '4') screenshotBlur('Screenshot attempt on iOS');
            });

            document.addEventListener('keydown', e => {
                if (e.shiftKey && e.key.toLowerCase() === 's') screenshotBlur(
                    'Possible screenshot attempt (Shift+S)');
            });

        })(window, document);
    </script>
</body>

</html>
