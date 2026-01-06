import common from "./common.js"
import ImageWidget from "./widgets/img.js";
import TextWidget from "./widgets/text.js";

export function importArticle(article) {
    let data
    try {
        data = JSON.parse(article)
    } catch {
        alert("error parsing article")
        error("error parsing article")
    }

    if (data["nano-cms"]) {
        if (data["nano-cms"].version > common.version) {
            alert("this article appears to have been built with a newer version of the builder, beware!")
        }
    }

    let constructionMap = {
        metadata: {
            title: document.getElementById("title"),
            description: document.getElementById("description"),
            authors: document.getElementById("authorship"),
            tags: document.getElementById("tags"),
        },
    };

    let widgets = []

    constructionMap.metadata.title.textContent = data.metadata.title
    constructionMap.metadata.description.textContent = data.metadata.description
    constructionMap.metadata.authors.textContent = data.metadata.authors
    constructionMap.metadata.tags.textContent = data.metadata.tags
    

    for (let index in data.content) {
        let widget = data.content[index]
        console.log(widget)
        if (typeof widget == "object") {
            if (widget.type) {
                switch (widget.type) {
                    case "img": {
                        let newWidget = new ImageWidget(widget.data)
                        widgets.push(newWidget)
                        break;
                    }
                    default:
                        alert("unknown widget '" + widget.type + "', ignoring")
                }
            } else {
                alert("article contains invalid widgets")
                error("article contains invalid widgets")
            }
        } else if (typeof widget == "string") {
            let newWidget = new TextWidget(widget)
            widgets.push(newWidget)
        }
    }

    alert("import complete")
    return [constructionMap, widgets]

}