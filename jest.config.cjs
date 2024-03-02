module.exports = {
	transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
	collectCoverage: false,
	collectCoverageFrom: ["src/**/*.{js,jsx}"],
	coverageDirectory: "coverage"
}