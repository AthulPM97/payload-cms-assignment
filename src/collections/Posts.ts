import { CollectionConfig } from "payload/types";

export const Posts: CollectionConfig = {
  slug: "posts",
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "email",
      type: "email",
    },
  ],
};
