import path from "path";

import { payloadCloud } from "@payloadcms/plugin-cloud";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { buildConfig } from "payload/config";

import {
  LinkFeature,
  SuperscriptTextFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import Users from "./collections/Users";
import { Posts } from "./collections/Posts";

import { CustomMarkFeature } from "./lexical-extensions/customMarkFeature";
import { CustomSuperScript } from "./lexical-extensions/customSuperScript";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    livePreview: {
      url: "http://localhost:3000",
      collections: ["users", "posts"],
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => {
      const newFeatures = defaultFeatures.filter(
        (item) => item.key !== "subscript"
      );
      return [...newFeatures, CustomMarkFeature(), CustomSuperScript()];
    },
  }),
  collections: [Users, Posts],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [payloadCloud()],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
