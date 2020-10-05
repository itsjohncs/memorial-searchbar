import generateRandomGallery from "./generateRandomGallery";
import doesItemMatchQuery from "./query/doesItemMatchQuery";
import parseQuery from "./query/parseQuery";

import "./index.css";


function extractUrlParams(url) {
    const result = {};
    const params = new URL(url, "http://x.invalid").searchParams;
    for (const k of params.keys()) {
        result[k] = Array.from(params.getAll(k));
    }

    return result;
}

function prepareSearchableItems(gallery) {
    const items = [];
    for (const link of gallery.querySelectorAll("a")) {
        items.push({
            fields: extractUrlParams(link.getAttribute("href")),
            element: link,
        });
    }

    return items;
}


function handleQuery(rawQuery) {
    const query = parseQuery(rawQuery);
    for (const item of items) {
        if (doesItemMatchQuery(item, query)) {
            item.element.classList.remove("hidden");
        } else {
            item.element.classList.add("hidden");
        }
    }
}


generateRandomGallery(document.getElementById("gallery"), 50);


const items = prepareSearchableItems(document.getElementById("gallery"));

const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("keyup", function(event) {
    handleQuery(event.target.value);
});
searchbar.value = "age:18-";
handleQuery(searchbar.value);
