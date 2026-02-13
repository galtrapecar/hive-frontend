/** @type {import("@rtk-query/codegen-openapi").ConfigFile} */
const config = {
  schemaFile: "http://localhost:3000/swagger/json",
  apiFile: "./baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./generatedApi.ts",
  exportName: "generatedApi",
  hooks: true,
};

module.exports = config;
