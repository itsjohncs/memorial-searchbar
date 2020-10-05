import "./index.css";
import generateRandomGallery from "./generateRandomGallery";


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

function parseQuery(query) {
    const FIELD_KEY_RE = /([a-zA-Z0-9-_]+):/;

    const flattenedFields = ["name"];
    let start = 0;
    while (true) {
        const match = FIELD_KEY_RE.exec(query.slice(start));
        if (match) {
            flattenedFields.push(query.slice(start, start + match.index));
            flattenedFields.push(match[1]);
            start += match.index + match[0].length;
        } else {
            flattenedFields.push(query.slice(start));
            break;
        }
    }

    const fields = {};
    for (let i = 0; i < flattenedFields.length; i += 2) {
        const k = flattenedFields[i].trim();
        const v = (
            flattenedFields[i + 1].trim()
                .split(",")
                .map(i => i.trim())
                .filter(i => !!i));
        if (v.length === 0){
            continue;
        } else if (fields[k]) {
            // A space around the comma means that it can't be escaped by a
            // rogue forward slash in the field. Otherwise a:\ a:b could result
            // in \,b.
            fields[k] = fields[k].concat(v);
        } else {
            fields[k] = v;
        }
    }

    return fields;
}

function extractRange(fieldValue) {
    const match = /^([0-9]*\s*)?-([0-9]*\s*)?$/.exec(fieldValue);
    if (match && (match[1] || match[2])) {
        return {
            start: match[1] ? parseInt(match[1], 10) : Number.NEGATIVE_INFINITY,
            end: match[2] ? parseInt(match[2], 10) : Number.POSITIVE_INFINITY,
        } 
    } else {
        return null;
    }
}

function toNumber(str) {
    if (/^[0-9]+$/.text(str)) {
        return parseInt(str, 10);
    } else {
        return null;
    }
}

function doesItemMatchQuery(item, query) {
    for (const [fieldName, queryValues] of Object.entries(query)) {
        if (!item.fields[fieldName]) {
            return false;
        }

        let found = false;
        for (const queryValue of queryValues) {
            const range = extractRange(queryValue);
            if (range) {
                for (const itemValue of item.fields[fieldName]) {
                    const num = toNumber(itemValue);
                    if (num !== null && num >= range.start &&
                            num <= range.end) {
                        found = true;
                        break;
                    }
                }
            } else {
                for (const itemValue of item.fields[fieldName]) {
                    if (itemValue.indexOf(queryValue) !== -1) {
                        found = true;
                        break;
                    }
                }
            }

            if (found) {
                break;
            }
        }

        if (!found) {
            return false;
        }
    }

    return true;
}


generateRandomGallery(document.getElementById("gallery"), 50);


const items = prepareSearchableItems(document.getElementById("gallery"));
document.getElementById("searchbar").addEventListener("keyup", function(event) {
    const query = parseQuery(event.target.value);
    for (const item of items) {
        if (doesItemMatchQuery(item, query)) {
            item.element.classList.remove("hidden");
        } else {
            item.element.classList.add("hidden");
        }
    }
});
