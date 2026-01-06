import Widget from '../widget.js';

export default class ImageWidget extends Widget {
    constructor(data) {
        super("img", data);
    }

    ready(parentElement) {
        const img = document.createElement("img");
        const absoluteUrl = new URL("../../../../img/favicon.svg", window.location.href).href
        const container = this._element.querySelector(".widget-content")
        img.src = absoluteUrl
        const urlInput = document.createElement("input")
        urlInput.type = "text"
        urlInput.placeholder = "write URL..."
        urlInput.value = absoluteUrl
        container.appendChild(img)
        container.appendChild(urlInput)
    }

    healthCheck() {
        this.issues = {
            warnings: [],
            errors: []
        };
        
        return this.issues;
    }

    buildElement() {
        const paragraph = document.createElement('p');
        paragraph.textContent = this.data;
        paragraph.contentEditable = "true";
        this._element.querySelector('.widget-content').appendChild(paragraph);

        return paragraph
    }



}