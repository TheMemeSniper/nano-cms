import common from './modules/common.js';
import TextWidget from './modules/widgets/text.js';

const toolPanelButtons = {
    text: document.getElementById('tool-panel-text'),
    image: document.getElementById('tool-panel-image'),
    build: document.getElementById('tool-panel-json'),
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
    globalIssues = {};
    for (let widget of Object.values(widgets)) {
        const issues = widget.healthCheck();
        console.log(`Widget ${widget.id} issues:`, issues);
        globalIssues[widget.id] = issues;
    }
    console.log(globalIssues)
    issuesFound = "";
    let totalIssues = 0;
    let orderedWidgets = getOrderedWidgets();

    for (let widgetId in globalIssues) {
        const issues = globalIssues[widgetId];
        if (issues.errors.length > 0) {
            statusBar.classList.add('error');
            issuesFound += `Widget ${orderedWidgets.indexOf(widgets[widgetId]) + 1} has the following errors:\n- ${issues.errors.join('\n- ')}\n\n`;
            totalIssues += issues.errors.length;
        } else if (issues.warnings.length > 0) {
            statusBar.classList.add('warning');
            issuesFound += `Widget ${orderedWidgets.indexOf(widgets[widgetId]) + 1} has the following warnings:\n- ${issues.warnings.join('\n- ')}\n\n`;
            totalIssues += issues.warnings.length;
        }
    }

    if (issuesFound == "") {
        statusBar.textContent = "wonderhoy~!";
    } else {
        statusBar.textContent = `${totalIssues} issue(s) found. click for details...`;
    }


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

    if (issues.errors.length > 0) {
        updateStatus();
        return;
    }

    // Insert into construction site
    widget.buildElement();
    widget.ready(constructionSite);
    widgets[widget.id] = widget;
    updateStatus();
}

toolPanelButtons.text.addEventListener('click', () => {
    const widget = new TextWidget("New text");

    buildWidget(widget);
    widget.editCallback = (reason) => {
        if (reason == "deleted") {
            // deleted
            delete globalIssues[widget.id];
            delete widgets[widget.id];
            updateStatus();
            return;
        }
        // edited
        updateStatus();
    };

});

toolPanelButtons.build.addEventListener('click', () => {
    build();
});

function build() {
    console.log("Building content...");
    let orderedWidgets = getOrderedWidgets();
    content.content = orderedWidgets.map(widget => {
        if (widget.type == "text") {
            return widget.data;
        } else {
            return {
                type: widget.type,
                data: widget.data
            }
        }
    });
    content.metadata.title = constructionMap.metadata.title.textContent;
    content.metadata.description = constructionMap.metadata.description.textContent;
    content.metadata.authors = constructionMap.metadata.authors.textContent;
    content.metadata.tags = constructionMap.metadata.tags.textContent;

    let built = JSON.stringify(content, null, 2);
    console.log(built);

    var newTab = window.open('', '_blank');
    if (newTab) {
        newTab.document.write('<pre>' + built + '</pre>');
        newTab.document.close();
    } else {
        alert("export popup blocked! please enable popups for this site (or nab your JSON from the console. its there too)");
    }
}