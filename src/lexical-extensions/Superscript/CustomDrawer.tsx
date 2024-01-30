import React, { useEffect, useState } from "react";
import { useModal } from "@faceless-ui/modal";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
} from "lexical";

import { TOGGLE_SUPERSCRIPT_WITH_MODAL_COMMAND } from "../commands";

import { Drawer, formatDrawerSlug } from "payload/components/elements";
import { Form } from "payload/components/forms";
import { RenderFields } from "payload/components/forms";
import { FormSubmit } from "payload/components/forms";
import { fieldTypes } from "payload/components/forms";
import { useConfig, useEditDepth } from "payload/components/utilities";
import { useEditorConfigContext } from "@payloadcms/richtext-lexical";
import { Data, Field, Fields, GroupField } from "payload/types";
import { sanitizeFields } from "payload/config";
import { $createFootnoteNode, $getFootnoteCount } from "./FootnoteNode";

const baseClass = "lexical-link-edit-drawer";

export function YourCustomEditor({}) {
  const config = useConfig();
  const [initialState, setInitialState] = useState<Fields>({});
  const fieldSchema: Field[] = [
    { name: "description", type: "textarea", label: "Content" },
  ];

  const [editor] = useLexicalComposerContext();
  const { toggleModal, closeModal } = useModal();
  const editDepth = useEditDepth();
  const { uuid } = useEditorConfigContext();

  const drawerSlug = formatDrawerSlug({
    depth: editDepth,
    slug: `lexical-rich-text-super-` + uuid,
  });
  global.superScriptDrawerSlug = drawerSlug

  // handlers
  const handleModalSubmit = (fields: Fields, data: Data) => {
    editor.update(() => {
      const selection = $getSelection();
      const nodeTree = editor.getEditorState()._nodeMap;
      if ($isRangeSelection(selection)) {
        const id = $getFootnoteCount(nodeTree) + 1;
        const nodes = selection.getNodes();
        const lastSelectedNode = nodes[nodes.length - 1];
        if (nodes) {
          const newFootnoteNode = $createFootnoteNode({
            fields: { description: data.description, id },
          });
          lastSelectedNode.insertAfter(newFootnoteNode);
        }
      }
    });
    closeModal(drawerSlug);
  };

  // useEffect block to register your custom command
  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_SUPERSCRIPT_WITH_MODAL_COMMAND,
      (payload) => {
        // Open the modal
        toggleModal(drawerSlug);

        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, toggleModal, drawerSlug]);

  return (
    <React.Fragment>
      <Drawer className={baseClass} slug={drawerSlug} title="Edit Footnote">
        <Form
          fields={fieldSchema}
          initialState={initialState}
          onSubmit={handleModalSubmit}
        >
          <RenderFields
            fieldSchema={fieldSchema}
            fieldTypes={fieldTypes}
            forceRender
            readOnly={false}
          />
          <FormSubmit>submit</FormSubmit>
        </Form>
      </Drawer>
    </React.Fragment>
  );
}
