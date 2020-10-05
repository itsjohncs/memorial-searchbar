function urlEncode(str) {
    return encodeURIComponent(str).replace(/%20/g, "+");
}


function urlEncodeObject(obj) {
    const encodedParts = [];
    for (const [k, v] of Object.entries(obj)) {
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
    const colors = ["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "orange", "aliceblue", "antiquewhite", "aquamarine", "azure", "beige", "bisque", "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan"];
    const names = [
        "May Carey",
        "Chenda Thompkins",
        "Lorena Morello",
        "Tatenda Waterman",
        "Prakash Kjeldsen",
    ];
    for (let i = 0; i < numItems; ++i) {
        const img = document.createElement("img");
        img.setAttribute("src", blankSvgAsDataUri(selectRandomly(colors)));
        img.setAttribute("alt", selectRandomly(names));
        
        const fields = {
            age: "" + Math.floor(Math.random() * 40),
        };
        
        const link = document.createElement("a");
        link.setAttribute("href", "/?" + urlEncodeObject(fields));
        link.appendChild(img);
        
        container.appendChild(link);
    }
}


export default generateRandomGallery;
