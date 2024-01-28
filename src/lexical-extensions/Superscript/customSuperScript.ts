import {
  type FeatureProvider,
  type Feature,
  convertLexicalNodesToHTML,
  HTMLConverter,
} from "@payloadcms/richtext-lexical";
import { SectionWithEntries } from "../floatingSelectToolbarSection";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";

import { TOGGLE_SUPERSCRIPT_WITH_MODAL_COMMAND } from "../commands";
import { FootnoteNode, SerializedFootnoteNode } from "./FootnoteNode";

export const CustomSuperScript = (): FeatureProvider => {
  return {
    feature: (props): Feature => {
      return {
        floatingSelectToolbar: {
          sections: [
            SectionWithEntries([
              {
                ChildComponent: () => {
                  return Promise.resolve()
                    .then(
                      () =>
                        import(
                          "@payloadcms/richtext-lexical/dist/field/lexical/ui/icons/Superscript"
                        )
                    )
                    .then((module) => module.SuperscriptIcon);
                },
                isActive: ({ selection }) => {
                  if ($isRangeSelection(selection)) {
                    return selection.hasFormat("superscript");
                  }
                  return false;
                },
                key: "superscript",
                onClick: ({ editor, isActive }) => {
                  editor.dispatchCommand(
                    TOGGLE_SUPERSCRIPT_WITH_MODAL_COMMAND,
                    null
                  );
                },
                order: 6,
              },
            ]),
          ],
        },
        plugins: [
          {
            Component: () =>
              import("./FloatingEditor").then(
                (module) => module.FloatingSuperScriptEditorPlugin
              ),
            position: "normal",
          },
        ],
        nodes: [
          // ... other nodes
          {
            converters: {
              html: {
                converter: async ({ converters, node, parent }) => {
                  const childrenText = await convertLexicalNodesToHTML({
                    converters,
                    lexicalNodes: node.children,
                    parent: {
                      ...node,
                      parent,
                    },
                  });

                  const footnoteContent = node.fields.id || "";
                  return `<sup>${footnoteContent}</sup>`;
                },
                nodeTypes: [FootnoteNode.getType()],
              } as HTMLConverter<SerializedFootnoteNode>,
            },
            node: FootnoteNode,
            type: FootnoteNode.getType(),
          },
        ],
        props: null,
      };
    },
    key: "superscript",
  };
};
