export default {
    plugins: {
        // Use the PostCSS adapter for Tailwind; do NOT include the
        // `tailwindcss` plugin here directly when using PostCSS adapter.
        "@tailwindcss/postcss": {},
        autoprefixer: {},
    },
}
