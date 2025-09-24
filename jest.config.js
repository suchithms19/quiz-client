module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.ts$': 'ts-jest', 
    },
    transformIgnorePatterns: [
        '/node_modules/(?!flat)/', 
    ],

};