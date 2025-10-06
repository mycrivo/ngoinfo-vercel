import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@features/(.*)$": "<rootDir>/features/$1",
    "^@ui/(.*)$": "<rootDir>/ui/$1",
    "^@lib/(.*)$": "<rootDir>/lib/$1",
    "^@services/(.*)$": "<rootDir>/services/$1",
    "^@types/(.*)$": "<rootDir>/types/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"]
};

export default config;


