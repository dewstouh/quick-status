import { config as base } from "@quick-status/eslint-config/base";

export default [
    ...base,
    {
        ignores: ["dist/**", "coverage/**", "generated/**"],
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off", // exception
        },
    }
];