import Widget from "../widget.js";

let marked = window.marked;
const template = document.querySelector("#rich-text-editor");

export default class RichTextWidget extends Widget {
  constructor(data) {
    super("richtext", data);
  }

  ready(parentElement) {
    const textarea = this._element.querySelector(".rich-text-textarea");
    textarea.addEventListener("input", () => {
      this.data = textarea.value;
      if (this.editCallback) {
        this.editCallback(this);
      }
    });
    parentElement.appendChild(this._element);
    this._element = parentElement.lastElementChild;
  }

  healthCheck() {
    this.issues = {
      warnings: [],
      errors: [],
    };

    if (this.data.trim() == "") {
      this.issues.warnings.push("RichTextWidget appears to be empty");
    }

    return this.issues;
  }

  buildElement() {
    const editor = document.importNode(template.content, true);

    const mdTab = editor.querySelector(".rich-text-tab-md");
    const previewTab = editor.querySelector(".rich-text-tab-preview");

    const editorArea = editor.querySelector(".rich-text-editor");
    const previewArea = editor.querySelector(".rich-text-preview");

    const textarea = editor.querySelector(".rich-text-textarea");

    textarea.textContent = this.data;

    mdTab.addEventListener("click", () => {
      editorArea.style = "";
      previewArea.style = "display: none";
    });

    previewTab.addEventListener("click", () => {
      editorArea.style = "display: none";
      previewArea.style = "";
      previewArea.textContent = "parsing... please wait";
      const parsed = marked.parse(textarea.value);
      previewArea.innerHTML = parsed;
    });

    this._element.querySelector(".widget-content").appendChild(editor);

    return editor;
  }
}
