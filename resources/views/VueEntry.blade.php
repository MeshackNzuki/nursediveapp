<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Nursenex - Comprehensive nursing school, TEAS and NCLEX exam prep. Realistic question banks, focused remediation, and performance analytics.">
    <meta name="keywords"
        content="Nursenex, nursing exams, TEAS prep, HESI, NCLEX, nursing school, online test prep, adaptive learning">
    <meta name="author" content="Nursenex Team">

    <!-- Open Graph (for sharing previews) -->
    <meta property="og:title" content="Nursenex | Nursing School, TEAS & NCLEX Exam Prep">
    <meta property="og:description"
        content="Join thousands of students acing nursing exams with Nursenex. Get started free today.">
    <meta property="og:image" content="https://app.nursenex.com/assets/favicon.png">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

    <title>{{ config('app.name', 'Nursenex') }}</title>

    @vite(['resources/js/main.ts'])
</head>

<body class="">
    <div id="loading" class="fixed inset-0 bg-sky-950/95 z-50 flex items-center justify-center">
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
            function isProtectedExamPage() {
                const path = window.location.pathname;
                return path.startsWith('/nursing/exam/') ||
                    path.startsWith('/teas/exam/') ||
                    path === '/nclex/exam' ||
                    path.startsWith('/nclex/exam/');
            }

            function syncProtectionState() {
                const protected = isProtectedExamPage();
                document.body.classList.toggle('exam-content-protected', protected);
                if (!protected) document.body.style.filter = 'none';
            }

            function onRouteChange() {
                setTimeout(syncProtectionState, 0);
            }

            ['pushState', 'replaceState'].forEach(method => {
                const original = history[method];
                history[method] = function() {
                    const result = original.apply(this, arguments);
                    onRouteChange();
                    return result;
                };
            });

            window.addEventListener('popstate', onRouteChange);
            window.addEventListener('hashchange', onRouteChange);
            syncProtectionState();

            // =========================
            // BLUR + OVERLAY FUNCTION
            // =========================
            function screenshotBlur(message = 'Screenshot detected') {
                if (!isProtectedExamPage()) return;

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
                document.addEventListener(ev, e => {
                    if (isProtectedExamPage()) e.preventDefault();
                });
            });

            const styleSelect = document.createElement('style');
            styleSelect.type = 'text/css';
            styleSelect.media = 'screen';
            styleSelect.innerHTML = `
            body.exam-content-protected * {
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
            stylePrint.innerHTML = 'body.exam-content-protected{display:none !important;}';
            document.head.appendChild(stylePrint);

            // =========================
            // KEYBOARD BLOCKING
            // =========================
            document.addEventListener('keydown', e => {
                if (!isProtectedExamPage()) return;

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
                    if (!isProtectedExamPage()) return;

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
                if (!isProtectedExamPage()) return;

                const k = e.key.toLowerCase();
                if (k === 'printscreen') screenshotBlur();
                if (e.metaKey && e.shiftKey && k === 's') screenshotBlur('Win+Shift+S detected');
                if ((navigator.platform.includes('iPhone') || navigator.platform.includes('iPad')) &&
                    e.metaKey && e.shiftKey && k === '4') screenshotBlur('Screenshot attempt on iOS');
            });

            document.addEventListener('keydown', e => {
                if (!isProtectedExamPage()) return;

                if (e.shiftKey && e.key.toLowerCase() === 's') screenshotBlur(
                    'Possible screenshot attempt (Shift+S)');
            });

        })(window, document);
    </script>
</body>

</html>
