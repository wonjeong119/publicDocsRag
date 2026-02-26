/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#059669",
                "primary-dark": "#047857",
                "primary-deep": "#064e3b",
                "primary-light": "#ecfdf5",
                "emerald-subtle": "#d1fae5",
                "deep-charcoal": "#1f2937",
                "background-light": "#F9FAFB",
                "background-dark": "#0B1110",
                "accent-success": "#10B981",
                "accent-warning": "#F59E0B",
                "accent-danger": "#EF4444",
            },
            fontFamily: {
                "display": ["Pretendard", "Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.375rem",
                "lg": "0.75rem",
                "xl": "1.25rem",
                "2xl": "1.5rem",
                "full": "9999px"
            },
            boxShadow: {
                'report': '0 8px 30px rgba(0, 0, 0, 0.02)',
            }
        },
    },
    plugins: [],
}
