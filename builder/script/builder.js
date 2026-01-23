import common from "./modules/common.js";
import ImageWidget from "./modules/widgets/img.js";
import TextWidget from "./modules/widgets/text.js";
import { importArticle } from "./modules/importer.js";
import VideoWidget from "./modules/widgets/vid.js";
import RichTextWidget from "./modules/widgets/richtext.js";
import { getFileList, saveFileList } from "./modules/stash.js";

const toolPanelButtons = {
  text: document.getElementById("tool-panel-text"),
  markdown: document.getElementById("tool-panel-text-rich"),
  image: document.getElementById("tool-panel-img"),
  video: document.getElementById("tool-panel-vid"),
  build: document.getElementById("tool-panel-build"),
  import: document.getElementById("tool-panel-import"),
  stash: document.getElementById("tool-panel-stash"),
};

const panels = {
  darken: document.getElementById("darken"),
  stash: document.getElementById("stash-panel"),
  stashClose: document.getElementById("stash-panel-close"),
};

const statusBar = document.getElementById("status-text");

const constructionSite = document.getElementById("construction-site");

let content = {
  "nano-cms": {
    version: common.version,
  },
  metadata: {
    title: "Untitled Article",
    description: "This is a sample article created using Nano CMS.",
    authors: "Jane Doe",
    tags: "sample, nano cms, article",
  },
  content: [],
};
// Maps the required metadata content structure to DOM elements
let constructionMap = {
  metadata: {
    title: document.getElementById("title"),
    description: document.getElementById("description"),
    authors: document.getElementById("authorship"),
    tags: document.getElementById("tags"),
    date: document.getElementById("date"),
  },
};

window.constructionMap = constructionMap;

let widgets = [];
window.widgets = widgets;

let globalIssues = {};
let issuesFound = "";
window.globalIssues = globalIssues;
window.issuesFound = issuesFound;

document.getElementById("version-header").textContent =
  "version " + common.version;

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
  statusBar.classList.remove("error", "warning");
  globalIssues = {};
  for (let widget of Object.values(widgets)) {
    const issues = widget.healthCheck();
    console.log(`Widget ${widget.id} issues:`, issues);
    globalIssues[widget.id] = issues;
  }
  console.log(globalIssues);
  issuesFound = "";
  let totalIssues = 0;
  let orderedWidgets = getOrderedWidgets();

  for (let widgetId in globalIssues) {
    const issues = globalIssues[widgetId];
    if (issues.errors.length > 0) {
      statusBar.classList.add("error");
      issuesFound += `Widget ${
        orderedWidgets.indexOf(widgets[widgetId]) + 1
      } has the following errors:\n- ${issues.errors.join("\n- ")}\n\n`;
      totalIssues += issues.errors.length;
    } else if (issues.warnings.length > 0) {
      statusBar.classList.add("warning");
      issuesFound += `Widget ${
        orderedWidgets.indexOf(widgets[widgetId]) + 1
      } has the following warnings:\n- ${issues.warnings.join("\n- ")}\n\n`;
      totalIssues += issues.warnings.length;
    }
  }

  if (issuesFound == "") {
    statusBar.textContent = "wonderhoy~!";
  } else {
    statusBar.textContent = `${totalIssues} issue(s) found. click for details...`;
  }
}

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

function build() {
  console.log("Building content...");
  let orderedWidgets = getOrderedWidgets();
  content.content = orderedWidgets.map((widget) => {
    if (widget.type == "text") {
      return widget.data;
    } else {
      return {
        type: widget.type,
        data: widget.data,
      };
    }
  });
  content.metadata.title = constructionMap.metadata.title.textContent;
  content.metadata.description =
    constructionMap.metadata.description.textContent;
  content.metadata.authors = constructionMap.metadata.authors.textContent;
  content.metadata.date = constructionMap.metadata.date.value;
  content.metadata.type = "article";

  if (constructionMap.metadata.tags.textContent == "[no tags]") {
    content.metadata.tags = [];
  } else {
    content.metadata.tags =
      constructionMap.metadata.tags.textContent.split(" ");
  }

  let built = JSON.stringify(content, null, 2);
  console.log(built);

  const urlParams = new URLSearchParams();
  urlParams.set("article", built);

  window.location = `./export.html?${urlParams.toString()}`;
}

function defaultEditCallback(widget, reason) {
  if (reason == "deleted") {
    // deleted
    delete globalIssues[widget.id];
    delete widgets[widget.id];
    updateStatus();
    return;
  }
  // edited
  updateStatus();
}

function importHelper(article, disableAlerts) {
  let imported = importArticle(article, disableAlerts);
  constructionMap = imported[0];
  widgets = imported[1];
  console.log(imported, imported[0], imported[1]);

  for (let index in widgets) {
    let widget = widgets[index];
    console.log(widget);
    widget.editCallback = defaultEditCallback;
    buildWidget(widget);
  }
  updateStatus();
}

statusBar.addEventListener("click", () => {
  if (statusBar.textContent == "wonderhoy~!") {
    // Trust me its absolutely critical to the software
    window.open("https://www.youtube.com/watch?v=o1K7-QbrA2g", "_blank");
  } else {
    alert(issuesFound);
  }
});

toolPanelButtons.build.addEventListener("click", () => {
  build();
});

toolPanelButtons.text.addEventListener("click", () => {
  const widget = new TextWidget("New text");

  buildWidget(widget);
  widget.editCallback = defaultEditCallback;
});

toolPanelButtons.markdown.addEventListener("click", () => {
  const widget = new RichTextWidget("# Nano!");

  buildWidget(widget);
  widget.editCallback = defaultEditCallback;
});

toolPanelButtons.image.addEventListener("click", () => {
  const widget = new ImageWidget({
    src: new URL("./img/placeholder.png", window.location.href).href,
    alt: 'emu otori from project sekai cheering with the text "Placeholder" above her',
  });

  buildWidget(widget);
  widget.editCallback = defaultEditCallback;
});

toolPanelButtons.video.addEventListener("click", () => {
  const widget = new VideoWidget({
    src: new URL("./img/bees.mp4", window.location.href).href,
    fallback:
      "omni man from invincible telling mark about how they can finally be bees. they'll be pets. this is good news.",
  });

  buildWidget(widget);
  widget.editCallback = defaultEditCallback;
});

toolPanelButtons.import.addEventListener("click", async () => {
  let data = "";
  if (navigator.clipboard) {
    data = await navigator.clipboard.readText();
  }
  console.log(data);
  if (!data) {
    data = prompt(
      "we couldn't copy information from your clipboard. paste the article here:",
    );
  }
  importHelper(data);
});

toolPanelButtons.stash.addEventListener("click", () => {
  let fileList = getFileList();
  if (!fileList) {
    return;
  }
  panels.darken.classList.remove("hidden");
  panels.stash.classList.remove("hidden");
  for (const file in fileList) {
    let li = document.createElement("li");
    li.innerText = file;
    let button = document.createElement("button");
    button.id = "stash-filelist-" + file;
    button.innerText = "Load";
    button.onclick = () => {
      let confirmation = confirm("are you sure you want to load " + file + "?");
      if (!confirmation) {
        alert("ok cancelled");
        return;
      }
      console.log(file, fileList[file]);
      importHelper(fileList[file]);
      panels.darken.classList.add("hidden");
      panels.stash.classList.add("hidden");
    };
    li.appendChild(button);
    panels.stash.querySelector("#stash-file-list").appendChild(li);
  }
});

panels.stashClose.addEventListener("click", () => {
  panels.darken.classList.add("hidden");
  panels.stash.classList.add("hidden");
});

if (window.location.search !== "") {
  let usp = new URLSearchParams(window.location.search);
  if (usp.get("article")) {
    importHelper(usp.get("article"), true);
  }
}
