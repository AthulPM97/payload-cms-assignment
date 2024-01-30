"use client";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useModal } from "@faceless-ui/modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import "./index.scss";

import { createPortal } from "react-dom";
import { formatDrawerSlug } from "payload/components/elements";
import { useEditDepth } from "payload/components/utilities";
import { useEditorConfigContext } from "@payloadcms/richtext-lexical";
import { TOGGLE_FOOTNOTE_MODAL_COMMAND } from "../commands";
import { COMMAND_PRIORITY_NORMAL } from "lexical";

export function FootnoteModal() {
  const [isLink, setIsLink] = useState(false);
  const [description, setDescription] = useState("");
  const [editor] = useLexicalComposerContext();

  const { closeModal, toggleModal } = useModal();

  const editorRef = useRef(null);
  const editDepth = useEditDepth();
  const { uuid } = useEditorConfigContext();

  const drawerSlug = formatDrawerSlug({
    depth: editDepth,
    slug: `lexical-footnote-model-` + uuid,
  });

  useEffect(() => {
    if (!isLink && editorRef) {
      editorRef.current.style.opacity = "0";
      editorRef.current.style.transform = "translate(-10000px, -10000px)";
    } else {
      editorRef.current.style.opacity = "1";
      editorRef.current.style.transform = "translate(0, 0)";
    }
  }, [isLink]);

  useEffect(() => {
    editor.registerCommand(
      TOGGLE_FOOTNOTE_MODAL_COMMAND,
      (payload) => {
        setDescription(payload.description);
        setIsLink(true)
        toggleModal(drawerSlug);
        return true;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor]);
  return (
    <React.Fragment>
      <div className="link-editor" ref={editorRef}>
        <div className="link-input">
          <div>{description}</div>
          {editor.isEditable() && (
            <React.Fragment>
              <button
                aria-label="Edit link"
                className="link-edit"
                onClick={() => {
                  // toggleModal(drawerSlug);
                  toggleModal(global.superScriptDrawerSlug)
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                tabIndex={0}
                type="button"
              />
              <button
                aria-label="Remove link"
                className="link-trash"
                onClick={() => {
                  setIsLink(false)
                  closeModal(drawerSlug)
                }}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                tabIndex={0}
                type="button"
              />
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}
export const FootnoteModalPlugin: React.FC<{
  anchorElem: HTMLElement;
}> = (props) => {
  const { anchorElem = document.body } = props;

  return createPortal(<FootnoteModal />, anchorElem);
};
