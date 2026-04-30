import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
    persist: true,
    state: () => ({
        // Default theme
        currentTheme: "Light",

        currentFont: "Exo",

        // Available themes
        themes: {
            Blue: {
                name: "Blue",
                bg: "bg-linear-to-r from-sky-400 to-sky-600",
                text: "text-gray-100",
                ring: "ring-sky-500",
            },
            Cyan: {
                name: "Cyan",
                bg: "bg-linear-to-r from-cyan-600 to-cyan-800",
                text: "text-gray-100",
                ring: "ring-cyan-500",
            },
            Black: {
                name: "Black",
                bg: "bg-black",
                text: "text-gold",
                ring: "ring-gold",
            },
            Emerald: {
                name: "Emerald",
                bg: "bg-linear-to-r from-emerald-400 to-emerald-600",
                text: "text-gray-100",
                ring: "ring-emerald-500",
            },
            Lime: {
                name: "Lime",
                bg: "bg-linear-to-r from-lime-400 to-lime-600",
                text: "text-gray-800",
                ring: "ring-lime-500",
            },

            Light: {
                name: "Light",
                bg: "bg-linear-to-r from-sky-50 via-slate-100 to-sky-50",
                text: "text-gray-800",
                ring: "ring-sky-500",
            },
        },
        fonts: {
            Classic: {
                name: "Classic",
                font: "font-serif", // Serif font class
            },
            Modern: {
                name: "Modern",
                font: "font-sans", // Sans-serif font class
            },
            Mono: {
                name: "Mono",
                font: "font-mono", // Monospace font class
            },
            Elegant: {
                name: "Elegant",
                font: "font-classic", // Custom or unique font class
            },
            Exo: {
                name: "Exo",
                font: "font-exo", // Custom or unique font class
            },
            Outfit: {
                name: "Outfit",
                font: "font-outfit", // Custom or unique font class
            },
            Custom: {
                name: "Custom",
                font: "font-custom", // Custom or unique font class
            },
        },
    }),
    actions: {
        // Set the current theme
        setTheme(theme) {
            if (this.themes[theme]) {
                this.currentTheme = theme;
            }
        },
        setFont(font) {
            //this.$reset();
            if (this.fonts[font]) {
                this.currentFont = font;
            }
        },       
         resetTheme() {
            this.$reset();
        },
    },
});
