export default {
	preset: "ts-jest",
	clearMocks: true,
	testEnvironment: "jsdom",
	testEnvironmentOptions: { resources: "usable" },
	setupFilesAfterEnv: ["jest-extended"],
	testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
	globals: {
		"ts-jest": {
			tsconfig: {
				strict: true,
				esModuleInterop: true,
			},
		},
	},
};
