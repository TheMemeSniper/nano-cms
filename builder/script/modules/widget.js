// basic widget class
const template = document.querySelector("#widget-container");

export default class Widget {
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this._element = document.importNode(template.content, true);
        this.issues = {
            warnings: [],
            errors: []
        }
        // called when the underlying widget is edited
        this.editCallback = null;
        this.id = crypto.randomUUID();

        this._element.querySelector('.widget-delete').addEventListener('click', () => {
            this._element.remove();
            if (this.editCallback) {
                this.editCallback("deleted");
            }
        })

        this._element.querySelector('.widget-up').addEventListener('click', () => {
            const lastIndex = this.index;
            const previous = this._element.previousElementSibling;
            if (previous) {
                this._element.parentNode.insertBefore(this._element, previous);
                if (this.editCallback) {
                    this.editCallback("moved", lastIndex);
                }
            }
        })

        this._element.querySelector('.widget-down').addEventListener('click', () => {
            const lastIndex = this.index;
            const next = this._element.nextElementSibling;
            if (next) {
                this._element.parentNode.insertBefore(next, this._element);
                if (this.editCallback) {
                    this.editCallback("moved", lastIndex);
                }
            }
        })

        this._element.id = this.id;

    }

    ready(parentElement) {
        // called when the builder is ready to insert the widget into the construction site
        error("ready() not implemented for this widget type");
    }

    healthCheck() {
        // widget will check itself for problems and return its .issues object
        return {
            warnings: [],
            errors: ["healthCheck() not implemented for this widget type"]
        };
    }

    buildElement() {
        // returns the element to insert into the construction site
        // should only be called once to insert the element
        // all subsequent updates will edit the existing element, and healthCheck() will be called before building the JSON for real
        return undefined;
    }
}