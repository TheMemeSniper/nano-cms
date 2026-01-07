import Widget from '../widget.js';

export default class VideoWidget extends Widget {
    constructor(data) {
        super("vid", data);
    }

    ready(parentElement) {
        const content = this._element.querySelector('.widget-content');
        const video = content.querySelector('.widget-img')
        const urlInput = this._element.querySelector('.urlInput')
        const fallbackInput = this._element.querySelector('.fallbackInput')
        const fallbackParagraph = this._element.querySelector('.fallbackParagraph')

        urlInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                this.data.src = urlInput.value;
                if (this.editCallback) {
                    this.editCallback(this);
                }
                video.src = urlInput.value;
            }
        });

        fallbackInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()
                this.data.fallback = fallbackInput.value;
                if (this.editCallback) {
                    this.editCallback(this);
                }
                fallbackParagraph.textContent = fallbackInput.value;
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
            this.issues.errors.push("VideoWidget source URL must be valid")
            return this.issues;
        }

        if (!this.data.fallback || this.data.fallback.trim() == "") {
            this.issues.warnings.push("VideoWidget is missing a fallback description")
        }
        
        return this.issues;
    }

    buildElement() {
        const video = document.createElement("video");
        const container = this._element.querySelector(".widget-content")
        const urlLabel = document.createElement("label")
        const fallbackLabel = document.createElement("label")
        const urlInput = document.createElement("input")
        const fallbackInput = document.createElement("input")
        const inputContainer = document.createElement("div")
        const fallbackParagraph = document.createElement("p")

        container.classList.add("widget-img-container")
        inputContainer.classList.add("inputContainer")

        video.classList.add("widget-img")
        video.src = this.data.src
        video.controls = true

        urlInput.type = "text"
        urlInput.placeholder = "write URL..."
        urlInput.value = this.data.src
        urlInput.classList.add("urlInput")

        fallbackInput.type = "text"
        fallbackInput.placeholder = "describe this video, to be displayed when the video does not load or to be read by screenreaders"
        fallbackInput.value = this.data.fallback
        fallbackInput.classList.add("fallbackInput")

        const urlInputId = crypto.randomUUID()
        urlInput.id = urlInputId
        urlLabel.textContent = "URL"
        urlLabel.for = urlInputId

        const fallbackInputId = crypto.randomUUID()
        fallbackInput.id = fallbackInputId
        fallbackLabel.textContent = "fallback description"
        fallbackLabel.for = fallbackInputId

        fallbackParagraph.textContent = this.data.fallback
        fallbackParagraph.classList.add("fallpackParagraph")

        container.appendChild(video)
        video.appendChild(fallbackParagraph)
        container.appendChild(inputContainer)

        inputContainer.appendChild(urlLabel)
        inputContainer.appendChild(urlInput)
        inputContainer.appendChild(fallbackLabel)
        inputContainer.appendChild(fallbackInput)
    }



}