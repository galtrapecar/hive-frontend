/** @type {import("@rtk-query/codegen-openapi").ConfigFile} */
const config = {
  schemaFile: "http://localhost:3000/swagger/json",
  apiFile: "./baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./generatedApi.ts",
  exportName: "generatedApi",
  hooks: true,
  endpointOverrides: [
    {
      pattern: "aiControllerExtractOrderFromFile",
      type: "mutation",
      query: (endpointDefinition) => {
        return `
        query: (queryArg) => {
          const formData = new FormData();
          formData.append('file', queryArg.body.file);
          return {
            url: \`/ai/extract-order\`,
            method: "POST",
            body: formData,
          };
        }`;
      },
    },
  ],
};

module.exports = config;
