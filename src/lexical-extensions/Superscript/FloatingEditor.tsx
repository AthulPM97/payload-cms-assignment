"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { YourCustomEditor } from "./CustomDrawer";

export const FloatingSuperScriptEditorPlugin: React.FC<{
  anchorElem: HTMLElement;
}> = (props) => {
  const { anchorElem = document.body } = props;

  return createPortal(<YourCustomEditor />, anchorElem);
};
