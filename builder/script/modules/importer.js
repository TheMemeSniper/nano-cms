import common from "./common.js";

import ImageWidget from "./widgets/img.js";
import TextWidget from "./widgets/text.js";
import RichTextWidget from "./widgets/richtext.js";
import VideoWidget from "./widgets/vid.js";

let widgetMap = {
  img: ImageWidget,
  vid: VideoWidget,
  richtext: RichTextWidget,
};

export function importArticle(article, disableAlerts) {
  let data;
  if (typeof article == "object") {
    data = article;
  } else {
    try {
      data = JSON.parse(article);
    } catch {
      if (!disableAlerts) alert("error parsing article");
      console.error("error parsing article");
    }
  }

  if (!data) {
    return;
  }

  if (data.metadata) {
    if (data.metadata.type !== "article") {
      if (!disableAlerts) alert("this is not an article, aborting import");
      console.error(
        "attempted an import of a nano-cms file that isn't an article",
      );
      return;
    }
  }

  if (data["nano-cms"]) {
    if (data["nano-cms"].version > common.version) {
      if (!disableAlerts)
        alert(
          "this article appears to have been built with a newer version of the builder, beware!",
        );
    }
  }

  let constructionMap = {
    metadata: {
      title: document.getElementById("title"),
      description: document.getElementById("description"),
      authors: document.getElementById("authorship"),
      tags: document.getElementById("tags"),
      date: document.getElementById("date"),
    },
  };

  let widgets = [];

  constructionMap.metadata.title.textContent = data.metadata.title;
  constructionMap.metadata.description.textContent = data.metadata.description;
  constructionMap.metadata.authors.textContent = data.metadata.authors;
  constructionMap.metadata.tags.textContent = data.metadata.tags;
  constructionMap.metadata.date.value = data.metadata.date;

  for (let index in data.content) {
    let widget = data.content[index];
    console.log(widget);
    if (typeof widget == "object") {
      if (widget.type) {
        let newWidget = widgetMap[widget.type];
        if (newWidget == undefined) {
          if (!disableAlerts) alert("unknown widget " + widget.type);
          continue;
        }
        newWidget = new newWidget(widget.data);
        widgets.push(newWidget);
      } else {
        if (!disableAlerts) alert("article contains invalid widgets");
        console.error("article contains invalid widgets");
      }
    } else if (typeof widget == "string") {
      let newWidget = new TextWidget(widget);
      widgets.push(newWidget);
    }
  }

  if (!disableAlerts) alert("import complete");
  return [constructionMap, widgets];
}
