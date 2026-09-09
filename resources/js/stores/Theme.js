import { defineStore } from "pinia";

/**
 * Colour tokens per theme. These are exposed as CSS variables on the app root
 * (see App.vue) and consumed by the `theme-*` classes in assets/main.css, so a
 * component can follow the user's theme with static class names.
 *
 *  accent / accent2  gradient stops for solid theme surfaces
 *  on                text colour on top of a solid surface
 *  deep              text colour on a soft tint in light mode
 *  light             text colour on a soft tint in dark mode
 *  soft / border     translucent tint + border derived from the accent
 *  glow              stronger translucent accent for blurred highlights
 */
const THEME_TOKENS = {
    Light: {
        accent: "#0ea5e9", accent2: "#0284c7", on: "#ffffff",
        deep: "#0369a1", light: "#bae6fd",
        soft: "rgba(14, 165, 233, 0.10)", border: "rgba(14, 165, 233, 0.28)", glow: "rgba(14, 165, 233, 0.35)",
    },
    Blue: {
        accent: "#38bdf8", accent2: "#0284c7", on: "#f8fafc",
        deep: "#075985", light: "#bae6fd",
        soft: "rgba(56, 189, 248, 0.12)", border: "rgba(56, 189, 248, 0.32)", glow: "rgba(56, 189, 248, 0.40)",
    },
    Cyan: {
        accent: "#0891b2", accent2: "#155e75", on: "#f8fafc",
        deep: "#155e75", light: "#a5f3fc",
        soft: "rgba(8, 145, 178, 0.12)", border: "rgba(8, 145, 178, 0.32)", glow: "rgba(8, 145, 178, 0.38)",
    },
    Black: {
        accent: "#0f172a", accent2: "#1e293b", on: "#FBD0A0",
        deep: "#92400e", light: "#FBD0A0",
        soft: "rgba(251, 208, 160, 0.16)", border: "rgba(251, 208, 160, 0.38)", glow: "rgba(251, 208, 160, 0.35)",
    },
    Emerald: {
        accent: "#34d399", accent2: "#059669", on: "#f8fafc",
        deep: "#065f46", light: "#a7f3d0",
        soft: "rgba(52, 211, 153, 0.14)", border: "rgba(52, 211, 153, 0.34)", glow: "rgba(52, 211, 153, 0.40)",
    },
    Lime: {
        accent: "#a3e635", accent2: "#65a30d", on: "#1f2937",
        deep: "#3f6212", light: "#d9f99d",
        soft: "rgba(163, 230, 53, 0.16)", border: "rgba(163, 230, 53, 0.38)", glow: "rgba(163, 230, 53, 0.40)",
    },
    Violet: {
        accent: "#8b5cf6", accent2: "#4f46e5", on: "#f8fafc",
        deep: "#4c1d95", light: "#ddd6fe",
        soft: "rgba(139, 92, 246, 0.12)", border: "rgba(139, 92, 246, 0.32)", glow: "rgba(139, 92, 246, 0.40)",
    },
    Rose: {
        accent: "#f43f5e", accent2: "#db2777", on: "#ffffff",
        deep: "#9f1239", light: "#fecdd3",
        soft: "rgba(244, 63, 94, 0.11)", border: "rgba(244, 63, 94, 0.30)", glow: "rgba(244, 63, 94, 0.38)",
    },
    Sunset: {
        accent: "#f97316", accent2: "#f59e0b", on: "#ffffff",
        deep: "#9a3412", light: "#fed7aa",
        soft: "rgba(249, 115, 22, 0.12)", border: "rgba(249, 115, 22, 0.32)", glow: "rgba(249, 115, 22, 0.40)",
    },
};

export const useThemeStore = defineStore("theme", {
    // Only the user's choices persist; theme/font definitions always come from this file
    // so new themes and token changes reach users who already have a saved preference.
    persist: {
        paths: ["currentTheme", "currentFont"],
    },
    state: () => ({
        // Default theme
        currentTheme: "Light",

        currentFont: "Exo",

        // Available themes. `bg` / `text` / `ring` are Tailwind classes used by
        // HeaderNav, the buttons, tables and the Settings swatches.
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
            Violet: {
                name: "Violet",
                bg: "bg-linear-to-r from-violet-500 to-indigo-600",
                text: "text-gray-100",
                ring: "ring-violet-500",
            },
            Rose: {
                name: "Rose",
                bg: "bg-linear-to-r from-rose-500 to-pink-600",
                text: "text-gray-100",
                ring: "ring-rose-500",
            },
            Sunset: {
                name: "Sunset",
                bg: "bg-linear-to-r from-orange-500 to-amber-400",
                text: "text-gray-100",
                ring: "ring-orange-500",
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
    getters: {
        // The active theme definition (falls back to Light for unknown saved names).
        current(state) {
            return state.themes[state.currentTheme] || state.themes.Light;
        },
        // Raw colour tokens for the active theme.
        tokens(state) {
            return THEME_TOKENS[state.currentTheme] || THEME_TOKENS.Light;
        },
        // CSS custom properties, bound as an inline style on the app root.
        cssVars() {
            const t = this.tokens;
            return {
                "--theme-accent": t.accent,
                "--theme-accent-2": t.accent2,
                "--theme-on": t.on,
                "--theme-deep": t.deep,
                "--theme-light": t.light,
                "--theme-soft": t.soft,
                "--theme-border": t.border,
                "--theme-glow": t.glow,
            };
        },
        // True when the active theme has dark text on its surface (e.g. Lime).
        isDarkOnSurface() {
            return this.tokens.on === "#1f2937";
        },
    },
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
