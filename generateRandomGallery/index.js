import _colors from "./_colors";
import _names from "./_names";

import "./gallery.css";


function urlEncode(str) {
    return encodeURIComponent(str).replace(/%20/g, "+");
}


function urlEncodeKeyValues(keyValues) {
    const encodedParts = [];
    for (const [k, v] of keyValues) {
        if (typeof k !== "string" || typeof v !== "string") {
            throw new Error(
                "Both keys and values must be strings, got" +
                `key of type ${typeof k}, and value of type ${typeof v}:` +
                `[${k}, ${v}]`);
        }

        encodedParts.push(`${urlEncode(k)}=${urlEncode(v)}`);
    }

    return encodedParts.join("&");
}


function blankSvgAsDataUri(color) {
    const svg = 
        `<svg xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100%" height="100%" style="fill: ${color}" />
        </svg>`;
    return `data:image/svg+xml;utf8,${svg}`;
}


function selectRandomly(collection) {
    const index = Math.floor(
        Math.random() * collection.length);
    return collection[index];
}


function generateRandomGallery(container, numItems) {
    for (let i = 0; i < numItems; ++i) {
        const name = selectRandomly(_names);

        const img = document.createElement("img");
        img.setAttribute("src", blankSvgAsDataUri(selectRandomly(_colors)));
        img.setAttribute("alt", `${name}.jpg`);
        
        const fields = [
            ["name", name],
            ["age", "" + Math.floor(Math.random() * 40)],
            ["involved", selectRandomly([
                "on-duty-police",
                "off-duty-police",
                "other-hate-group"
            ])]
        ];
        
        const link = document.createElement("a");
        link.setAttribute("href", "/?" + urlEncodeKeyValues(fields));
        link.appendChild(img);        

        const description = document.createElement("div");
        description.setAttribute("class", "description");
        description.appendChild(document.createTextNode(
            fields.map(([k, v]) => `${k}: ${v}`).join("\n")));
        link.appendChild(description);
        
        container.appendChild(link);
    }
}


export default generateRandomGallery;
