// Your feature file should export a function that returns an object representing your feature.
//This object should include information about your feature, such as converters, nodes, and any other configurations.

import type { FeatureProvider, Feature } from "@payloadcms/richtext-lexical";
import { SectionWithEntries } from "./floatingSelectToolbarSection";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

import MarkIcon from "./customMarkIcon";

export const CustomMarkFeature = (): FeatureProvider => {
  return {
    feature: (props): Feature => {
      return {
        floatingSelectToolbar: {
          sections: [
            SectionWithEntries([
              {
                ChildComponent: MarkIcon,
                isActive: ({ selection }) => {
                  if ($isRangeSelection(selection)) {
                    return selection.hasFormat("highlight");
                  }
                  return false;
                },
                key: "customMark",
                onClick: ({ editor }) => {
                  editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                      const isMarked = selection.hasFormat("highlight");
                      // Wrap or unwrap selected text with <mark></mark> tags
                      // Apply or remove the mark format
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");

                      // If marked, remove the mark format
                      if (isMarked) {
                        editor.dispatchCommand(FORMAT_TEXT_COMMAND, null);
                      }
                    }
                  });
                },
                order: 5,
              },
            ]),
          ],
        },
        // markdownTransformers: markdownTransformers,
        props: props,
      };
    },
    key: "yourCustomFeature", // Unique key for your feature
  };
};
