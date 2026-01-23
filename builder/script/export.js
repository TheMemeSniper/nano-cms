import { getFileList, saveFileList } from "./modules/stash.js";

let exportControls = {
  copy: document.querySelector("#export-copy"),
  save: document.querySelector("#export-save-file"),
  stash: document.querySelector("#export-stash"),
  preview: document.querySelector("#export-preview"),
  editor: document.querySelector("#export-editor"),
};

const content = document.querySelector("#export-content");

const stashList = document.querySelector("#stash-file-list");
const stashControlsContainer = document.querySelector("#export-stash-controls");
const stashControls = {
  nameInput: document.querySelector("#export-stash-name"),
  nameSubmit: document.querySelector("#export-stash-submit"),
};

exportControls.copy.addEventListener("click", () => {
  navigator.clipboard
    .writeText(content.innerText)
    .then(() => {
      alert("copied!");
    })
    .catch((err) => {
      console.error(err);
      alert(
        "there was a problem copying your article :/ (check the console for more information)",
      );
    });
});

exportControls.stash.addEventListener("click", () => {
  let fileList = getFileList();

  if (!fileList) {
    return;
  }

  stashList.innerHTML = "";
  stashList.classList.remove("hidden");
  stashControlsContainer.classList.remove("hidden");

  for (const file in fileList) {
    let li = document.createElement("li");
    li.innerText = file;
    let button = document.createElement("button");
    button.id = "stash-filelist-" + file;
    button.innerText = "Overwrite";
    button.onclick = () => {
      let confirmation = confirm(
        "are you sure you want to overwrite " + file + "?",
      );
      if (!confirmation) {
        alert("ok cancelled");
        return;
      }
      fileList[file] = article;
      saveFileList(fileList);
      stashList.classList.add("hidden");
      stashControlsContainer.classList.add("hidden");
    };
    li.appendChild(button);
    stashList.appendChild(li);
  }
});

exportControls.preview.addEventListener("click", () => {
  window.location = "./preview.html" + window.location.search;
});

exportControls.editor.addEventListener("click", () => {
  window.location = "./index.html" + window.location.search;
});

stashControls.nameSubmit.addEventListener("click", () => {
  const name = stashControls.nameInput.value;
  if (name.trim() == "") {
    alert("name cannot be empty");
    return;
  }
  let fileList = getFileList();
  if (!fileList) {
    return;
  }

  if (fileList[name]) {
    let confirmation = confirm(
      "are you sure you want to overwrite " + name + "?",
    );
    if (!confirmation) {
      alert("ok cancelled");
      return;
    }
  }
  fileList[name] = article;
  saveFileList(fileList);

  stashControlsContainer.classList.add("hidden");
});

const urlParams = new URLSearchParams(window.location.search);
let article, query;
try {
  query = urlParams.get("article");
  if (!query) {
    alert("article param is empty");
  }
  article = JSON.parse(query);
} catch (e) {
  alert("error parsing article");
}

const title = article.metadata.title;
content.innerText = query;

const blob = new Blob([content.innerText], { type: "application/json" });
const url = URL.createObjectURL(blob);

stashControls.nameInput.value = title;

exportControls.save.setAttribute("download", title);
exportControls.save.setAttribute("href", url);
