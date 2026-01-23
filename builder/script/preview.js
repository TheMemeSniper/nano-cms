import { parse } from './keys/article.js';

const exportButton = document.querySelector("#preview-export")

const urlParams = new URLSearchParams(window.location.search);
let article, query;
try {
    query = urlParams.get('article')
    if (!query) {
        alert("article param is empty")
    }
    article = JSON.parse(query);
} catch (e) {
    alert("error parsing article")
}

exportButton.addEventListener("click", () => {
    window.location = "./export.html" + window.location.search
})

parse(article, document.querySelector("#preview-container"), window.marked, window.DOMPurify)