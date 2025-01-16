const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './', // Path to your Next.js app
});

const customJestConfig = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        // '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'

    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', // Support for absolute imports
    },
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional setup
};

module.exports = createJestConfig(customJestConfig)