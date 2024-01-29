import {
  ElementNode,
  LexicalNode,
  type NodeKey,
  isHTMLElement,
} from "lexical";
import type { BaseSelection, LexicalEditor } from "lexical";
import { $applyNodeReplacement } from "lexical";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalCommand,
  SerializedElementNode,
  Spread,
} from "lexical";
import { TOGGLE_FOOTNOTE_MODAL_COMMAND } from "../commands";

export type FootnoteFields = {
  description: string;
  id: number;
};

export type SerializedFootnoteNode = Spread<
  {
    fields: FootnoteFields;
  },
  SerializedElementNode
>;

export class FootnoteNode extends ElementNode {
  __fields: FootnoteFields;

  constructor({
    fields = {
      description: "",
      id: 0,
    },
    key,
  }: {
    fields: FootnoteFields;
    key?: NodeKey;
  }) {
    super(key);
    this.__fields = fields;
  }

  static clone(node: FootnoteNode): FootnoteNode {
    return new FootnoteNode({
      fields: node.__fields,
      key: node.__key,
    });
  }

  static getType(): string {
    return "footnote";
  }

  static importDOM(): DOMConversionMap | null {
    // return {
    //   a: (node: Node) => ({
    //     conversion: convertFootnoteElement,
    //     priority: 1,
    //   }),
    // }
    return null;
  }

  static importJSON(serializedNode: SerializedFootnoteNode): FootnoteNode {
    const node = $createFootnoteNode({
      fields: serializedNode.fields,
    });
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  canBeEmpty(): false {
    return false;
  }

  canInsertTextAfter(): false {
    return false;
  }

  canInsertTextBefore(): false {
    return false;
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const element = document.createElement("sup");
    element.textContent = this.__fields.id.toString(); // Display the footnote id as superscript
    element.style.borderBottom = "1px dotted";
    element.style.color = "#1E88E5";
    element.addEventListener("click", () => {
      editor.dispatchCommand(TOGGLE_FOOTNOTE_MODAL_COMMAND, {
        description: this.__fields.description,
      });
    });
    return element;
  }

  exportJSON(): SerializedFootnoteNode {
    return {
      ...super.exportJSON(),
      fields: this.getFields(),
      type: this.getType(),
    };
  }

  getFields(): FootnoteFields {
    return this.__fields;
  }

  insertNewAfter(): ElementNode | null {
    // Insert a new footnote node after the current selection
    return null;
  }

  isInline(): true {
    return true;
  }

  updateDOM(
    prevNode: FootnoteNode,
    element: HTMLElement,
    config: EditorConfig
  ): boolean {
    // Update the DOM element for your footnote
    // Check and update any specific properties
    element.textContent = this.__fields.id.toString(); // Update the content based on the id
    return false;
  }
}

export function $createFootnoteNode({
  fields,
}: {
  fields: FootnoteFields;
}): FootnoteNode {
  return $applyNodeReplacement(new FootnoteNode({ fields }));
}

export function $isFootnoteNode(
  node: LexicalNode | null | undefined
): node is FootnoteNode {
  return node instanceof FootnoteNode;
}

export function $getFootnoteCount(nodeTree: any) {
  const nodeArray = Array.from(nodeTree.values());
  if (!nodeTree || !nodeTree.values || typeof nodeTree.values !== "function") {
    return 0;
  }
  let count = 0;
  for (let i = 0; i < nodeArray.length; i++) {
    const node = nodeArray[i];
    if (node && node["__type"] === "footnote") {
      count++;
    }
  }
  return count;
}

function convertFootnoteElement(domNode: Node): DOMConversionOutput {
  let node: FootnoteNode | null = null;

  // Check if the provided DOM node is an HTML element
  if (isHTMLElement(domNode)) {
    const content = domNode.textContent;

    // Check if the element has non-empty text content
    if (content !== null && content !== "") {
      // Extract relevant information from the DOM element and create a FootnoteNode
      const fields = {
        // Extract relevant information from the DOM element attributes or content
        description: "...", // Replace with actual logic to extract description
        id: 1, // Replace with actual logic to extract id
      };

      node = $createFootnoteNode({
        fields: fields,
      });
    }
  }

  return { node };
}
