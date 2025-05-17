export default [
    {
        files: ["*.js"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module"
        },
        env: {
            browser: true,
            es2021: true
        },
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "double"]
        }
    }
];
