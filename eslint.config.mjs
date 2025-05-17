import eslintRecommended from "eslint/conf/eslint-recommended.js";

export default [
    eslintRecommended,
    {
        files: ["*.js"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                location: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly"
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "double"]
        }
    }
];
