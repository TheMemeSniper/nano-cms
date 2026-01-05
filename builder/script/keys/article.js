// very basic article content type key
// Nano Tip: a "key" is a cute name for a renderer for a specific content type
// kinda like a crate in rust

function parse(content, targetNode) {
    const article = document.createElement('article');
    const title = document.createElement('h1');
    title.textContent = content.metadata.title || 'Untitled Article';
    article.appendChild(title);

    const description = document.createElement('p');
    description.textContent = content.metadata.description || '';
    article.appendChild(description);

    const authors = document.createElement('p');
    authors.textContent = 'By: ' + (content.metadata.authors || 'Unknown Author');
    article.appendChild(authors);

    const tags = document.createElement('p');
    tags.textContent = 'Tags: ' + (content.metadata.tags || 'None');
    article.appendChild(tags);

    const br = document.createElement('br');
    article.appendChild(br);

    for (const widget of content.widgets) {
        if (typeof(widget) === 'string') {
            const paragraph = document.createElement('p');
            paragraph.textContent = widget;
            article.appendChild(paragraph);
        } else if (typeof(widget) === 'object' && widget.type) {
            switch (widget.type) {
                case 'image':
                    const img = document.createElement('img');
                    img.src = widget.src || '';
                    img.alt = widget.alt || '';
                    article.appendChild(img);
                    break;
                default:
                    console.warn('Unknown widget type: ' + widget.type);
            }
        }
    }
    targetNode.appendChild(article);
}