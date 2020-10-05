const FIELD_KEY_RE = /([a-zA-Z0-9-_]+):/;


function parseQuery(query) {
    // First we extract the fields into a single list, where items alternate
    // between key, value, key, value, etc.
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

    // Now we un-flatten the fields list, as well as do some small cleanups.
    // Note that every field value is an array, even if there's only zero or
    // one values.
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


export default parseQuery;
