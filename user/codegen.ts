import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  debug: true,
  overwrite: true,
  schema: "src/index.ts",
  generates: {
    "src/graphql.ts": {
      config: {
        federation: true,
        makeResolverTypeCallable: true,
        mappers: {
        },
        enumValues: {
        }
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};

export default config;
