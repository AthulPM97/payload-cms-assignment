import { CollectionConfig } from "payload/types";

export const Posts: CollectionConfig = {
    slug: 'posts',
    // auth: true,
    fields: [
        {
            name: 'title',
            type: 'text'
        },
        {
            name: 'content',
            type: 'richText'
        }
    ]
}