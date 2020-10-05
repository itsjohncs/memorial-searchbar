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
    if (/^[0-9]+$/.test(str)) {
        return parseInt(str, 10);
    } else {
        return null;
    }
}


function normalize(str) {
    return str.normalize("NFC").toLowerCase();
}


function doesQueryValueMatchAnyField(queryValue, fields) {
    const range = extractRange(queryValue);
    if (range) {
        // The query specified a range of numbers
        for (const itemValue of fields) {
            const num = toNumber(itemValue);
            if (num !== null && num >= range.start &&
                    num <= range.end) {
                return true;
            }
        }
    } else {
        // The query specified some text
        const normalizedQueryValue = normalize(queryValue);
        for (const itemValue of fields) {
            if (normalize(itemValue).indexOf(normalizedQueryValue) !== -1) {
                return true;
            }
        }
    }

    return false;
}


function doesItemMatchQuery(item, query) {
    for (const [fieldName, queryValues] of Object.entries(query)) {
        if (!item.fields[fieldName]) {
            return false;
        }

        // Each query value is ORed together. So if the search is
        // `a: 1, 2 a: 3` then we'll accept any item that has a 1, 2, or 3 in
        // it.
        const itemMatchesAnyValue = queryValues.some(function(queryValue) {
            return doesQueryValueMatchAnyField(
                queryValue, item.fields[fieldName]);
        });

        if (!itemMatchesAnyValue) {
            return false;
        }
    }

    return true;
}


export default doesItemMatchQuery;
