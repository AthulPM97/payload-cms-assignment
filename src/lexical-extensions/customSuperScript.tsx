import type { FeatureProvider, Feature } from "@payloadcms/richtext-lexical";
import { SectionWithEntries } from "./floatingSelectToolbarSection";
import {
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  createCommand,
} from "lexical";
const OPEN_SUPERSCRIPT_DRAWER_COMMAND: LexicalCommand<void> = createCommand();
import { useState } from "react";
import { SuperScriptEditor } from "./SuperScriptEditor";

import {
  Drawer,
  DrawerToggler,
  formatDrawerSlug,
} from "payload/components/elements";

export const CustomSuperScript = (): FeatureProvider => {
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  return {
    feature: (props): Feature => {
      return {
        floatingSelectToolbar: {
          sections: [
            SectionWithEntries([
              {
                ChildComponent: () => {
                  if (isEditorVisible) {
                    // return Promise.resolve().then(() => import(./SuperScriptEditor).then());
                  }

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
                  // editor.registerCommand(OPEN_SUPERSCRIPT_DRAWER_COMMAND, () => {
                  //   return (<Drawer className="abc" slug="abc" title="haha"></Drawer>)
                  // }, 3)
                  console.log("inside custom super script");
                  editor.dispatchCommand(OPEN_SUPERSCRIPT_DRAWER_COMMAND, null);
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
                },
                order: 6,
              },
            ]),
          ],
        },
        props: null,
      };
    },
    key: "superscript",
  };
};
