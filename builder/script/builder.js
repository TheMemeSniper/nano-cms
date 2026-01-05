import common from './modules/common.js';

const toolPanelButtons = {
    text: document.getElementById('tool-panel-text'),
    image: document.getElementById('tool-panel-image'),
}

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
// Maps the actual content structure to DOM elements
let constructionMap = {
    "metadata": {
        "title": document.getElementById('title'),
        "description": document.getElementById('description'),
        "authors": document.getElementById('authorship'),
        "tags": document.getElementById('tags'),
    }
}

toolPanelButtons.text.addEventListener('click', () => {
    const paragraph = document.createElement('p');
});