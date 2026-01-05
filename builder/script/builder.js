import common from './modules/common.js';
import TextWidget from './modules/widgets/text.js';

const toolPanelButtons = {
    text: document.getElementById('tool-panel-text'),
    image: document.getElementById('tool-panel-image'),
    build: document.getElementById('tool-panel-build'),
}

const statusBar = document.getElementById('status-text');

const constructionSite = document.getElementById('construction-site');

let content = {
    "nano-cms": {
       "version": common.version,
    },
    "metadata": {
        "title": "Untitled Article",
        "description": "This is a sample article created using Nano CMS.",
        "authors": "Jane Doe",
        "tags": "sample, nano cms, article",
    },
    "content": []
}
// Maps the required metadata content structure to DOM elements
let constructionMap = {
    "metadata": {
        "title": document.getElementById('title'),
        "description": document.getElementById('description'),
        "authors": document.getElementById('authorship'),
        "tags": document.getElementById('tags'),
    }
}

window.constructionMap = constructionMap;

let widgets = [];

let globalIssues = {};
let issuesFound = "";
window.globalIssues = globalIssues;
window.issuesFound = issuesFound;

function getOrderedWidgets() {
    let orderedWidgets = [];
    for (let element of constructionSite.children) {
        if (widgets[element.id]) {
            orderedWidgets.push(widgets[element.id]);
        }
    }
    return orderedWidgets;
}
window.getOrderedWidgets = getOrderedWidgets;

function updateStatus() {
    statusBar.textContent = "building...";
    statusBar.classList.remove('error', 'warning');
    console.log(globalIssues)
    issuesFound = "";


}

statusBar.addEventListener('click', () => {
    if (statusBar.textContent == "wonderhoy~!") {
        // Trust me its absolutely critical to the software
        window.open("https://www.youtube.com/watch?v=o1K7-QbrA2g", "_blank");
    } else {
        alert(issuesFound);
    }
});

function buildWidget(widget) {
    // check if the widget is good to go
    const issues = widget.healthCheck();

    globalIssues[widget.id] = issues;

    updateStatus();

    if (issues.errors.length > 0) {
        return;
    }

    // Insert into construction site
    widget.buildElement();
    widget.ready(constructionSite);
    widgets[widget.id] = widget;
}

function rebuildWidget(widget) {
    // check if the widget is good to go
    const issues = widget.healthCheck();

    globalIssues[widget] = issues;
    updateStatus();
}

toolPanelButtons.text.addEventListener('click', () => {
    const widget = new TextWidget("New text");

    buildWidget(widget);
    widget.editCallback = (reason) => {
        if (reason == "deleted") {
            // deleted
            delete globalIssues[widget];
            delete widgets[widget.id];
            updateStatus();
            return;
        }
        if (reason == "moved") {
            updateStatus();
            return;
        }
        // edited
        rebuildWidget(widget, widget.index);
    };

});

toolPanelButtons.build.addEventListener('click', () => {
    build();
});

function build() {
    // Update metadata
    for (let key in constructionMap.metadata) {
        content.metadata[key] = constructionMap.metadata[key].textContent;
    }
    // Update content
    for (let widget of Object.values(constructionMap.content)) {
        if (widget.type == "text") {
            // nano-cms files are meant to be easy to write by hand too so text widgets just store their raw text
            content.content.push(widget.data);
            continue;
        }
        content.content.push({
            type: widget.type,
            data: widget.data
        });
    }
    
    console.log(JSON.stringify(content, null, 2));
}