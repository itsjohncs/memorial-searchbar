function getShownFilters(mountPoint) {
    const shownFilters = new Map();
    const candidates = mountPoint.getElementsByClassName("integrated-query");
    for (const element of candidates) {
        shownFilters.set(element.dataset.filter, element);
    }
    return shownFilters;
}


function insertAfter(parentNode, referenceNode, node) {
    if (referenceNode === null) {
        parentNode.appendChild(node);
    } else {
        parentNode.insertBefore(node, referenceNode.nextSibling)
    }
}


function createIntegratedQuery(label, query) {
    const container = document.createElement("label")
    container.classList.add("integrated-query")
    container.dataset.filter = label;

    const queryElement = document.createElement("div");
    queryElement.classList.add("q");
    queryElement.appendChild(document.createTextNode(query));
    container.appendChild(queryElement);

    const labelElement = document.createElement("div");
    labelElement.classList.add("label");
    labelElement.appendChild(document.createTextNode(label));
    container.appendChild(labelElement);

    return container;
}


function syncIntegratedQueries({filters, selectedFilters, mountPoint}) {
    const shownFilters = getShownFilters(mountPoint);

    let insertAfterElement = (
        mountPoint.getElementsByClassName("integrated-queries-explainer")[0]);
    for (const [label, query] of filters) {
        if (selectedFilters.has(label) && !shownFilters.has(label)) {
            const integratedQueryElement = createIntegratedQuery(label, query);
            insertAfter(mountPoint, insertAfterElement,
                        integratedQueryElement);
            insertAfterElement = integratedQueryElement;
        } else if (!selectedFilters.has(label) && shownFilters.has(label)) {
            mountPoint.removeChild(shownFilters.get(label));
        } else if (shownFilters.has(label)) {
            insertAfterElement = shownFilters.get(label);
        }
    }

    if (selectedFilters.size === 0) {
        mountPoint.classList.add("hidden");
    } else {
        mountPoint.classList.remove("hidden");
    }
}


export default syncIntegratedQueries;
