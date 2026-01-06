import Widget from '../widget.js';

export default class TextWidget extends Widget {
    constructor(data) {
        super("text", data);
    }

    ready(parentElement) {
        const paragraph = this._element.querySelector('.widget-content');
        paragraph.addEventListener('input', () => {
            this.data = paragraph.textContent;
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
            errors: []
        };
        if (typeof this.data !== 'string') {
            this.issues.errors.push("TextWidget data must be a string");
            return this.issues;
        }
        if (!this.data || this.data.trim() === "") {
            this.issues.warnings.push("TextWidget is empty");
        }
        if (this.data.trim() == "New text") {
            this.issues.warnings.push("TextWidget appears to contain placeholder text");
        }
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