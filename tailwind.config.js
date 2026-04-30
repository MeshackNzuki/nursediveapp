/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.vue",
        "./resources/js/*/*.vue",
        "./node_modules/flowbite/**/*.js",
        "./app/Filament/**/*.php",
        "./resources/views/filament/**/*.blade.php",
        "./vendor/filament/**/*.blade.php",
    ],
    theme: {
        extend: {
            colors: {
                gold: "#FBD0A0",
                yellow: "#FF9900",
            },
            fontFamily: {
                exo: ['"Exo 2"', "sans-serif"],
                outfit: ['"Outfit"', "sans-serif"],
                custom: [
                    '"Trebuchet MS"',
                    '"Lucida Sans Unicode"',
                    '"Lucida Grande"',
                    '"Lucida Sans"',
                    "Arial",
                    "sans-serif",
                ],
            },
           
        },
    },

};
