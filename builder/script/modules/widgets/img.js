import Widget from "../widget.js";

export default class ImageWidget extends Widget {
  constructor(data) {
    super("img", data);
  }

  ready(parentElement) {
    const content = this._element.querySelector(".widget-content");
    const img = content.querySelector(".widget-img");
    const urlInput = this._element.querySelector(".urlInput");
    const altInput = this._element.querySelector(".altInput");

    urlInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.data.src = urlInput.value;
        if (this.editCallback) {
          this.editCallback(this);
        }
        img.src = urlInput.value;
      }
    });

    altInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.data.alt = altInput.value;
        if (this.editCallback) {
          this.editCallback(this);
        }
        img.alt = altInput.value;
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
    try {
      new URL(this.data.src);
    } catch {
      this.issues.errors.push("ImageWidget source URL must be valid");
      return this.issues;
    }

    if (!this.data.alt || this.data.alt.trim() == "") {
      this.issues.warnings.push("ImageWidget is missing alt text");
    }

    return this.issues;
  }

  buildElement() {
    const img = document.createElement("img");
    const container = this._element.querySelector(".widget-content");
    const urlLabel = document.createElement("label");
    const altLabel = document.createElement("label");
    const urlInput = document.createElement("input");
    const altInput = document.createElement("input");
    const inputContainer = document.createElement("div");

    container.classList.add("widget-img-container");
    inputContainer.classList.add("inputContainer");

    img.classList.add("widget-img");
    img.src = this.data.src;

    urlInput.type = "text";
    urlInput.placeholder = "write URL...";
    urlInput.value = this.data.src;
    urlInput.classList.add("urlInput");

    altInput.type = "text";
    altInput.placeholder = "describe this image";
    altInput.value = this.data.alt;
    altInput.classList.add("altInput");

    const urlInputId = crypto.randomUUID();
    urlInput.id = urlInputId;
    urlLabel.textContent = "URL";
    urlLabel.for = urlInputId;

    const altInputId = crypto.randomUUID();
    altInput.id = altInputId;
    altLabel.textContent = "alt text";
    altLabel.for = altInputId;

    container.appendChild(img);
    container.appendChild(inputContainer);

    inputContainer.appendChild(urlLabel);
    inputContainer.appendChild(urlInput);
    inputContainer.appendChild(altLabel);
    inputContainer.appendChild(altInput);
  }
}
