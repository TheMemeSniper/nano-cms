import Widget from '../widget.js';

export default class ImageWidget extends Widget {
    constructor(data) {
        super("img", data);
    }

    ready(parentElement) {
        const content = this._element.querySelector('.widget-content');
        const img = content.querySelector('.widget-img')
        const input = this._element.querySelector('input')
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                this.data = {"src": input.value};
                if (this.editCallback) {
                    this.editCallback(this);
                }
                img.src = input.value;
            }
        });
        parentElement.appendChild(this._element);
        this._element = parentElement.lastElementChild;
    }

    healthCheck() {
        this.issues = {
            warnings: [],
            errors: []
        };
        try {
            new URL(this.data.src)
        } catch {
            this.issues.errors.push("ImageWidget source URL must be valid")
            return this.issues;
        }
        
        return this.issues;
    }

    buildElement() {
        const img = document.createElement("img");
        const container = this._element.querySelector(".widget-content")
        const urlLabel = document.createElement("label")
        container.classList.add("widget-img-container")
        img.classList.add("widget-img")
        img.src = this.data.src
        const urlInput = document.createElement("input")
        urlInput.type = "text"
        urlInput.placeholder = "write URL..."
        urlInput.value = this.data.src
        const inputId = crypto.randomUUID()
        urlInput.id = inputId
        urlLabel.textContent = "URL"
        urlLabel.for = inputId
        container.appendChild(img)
        container.appendChild(urlLabel)
        container.appendChild(urlInput)
    }



}