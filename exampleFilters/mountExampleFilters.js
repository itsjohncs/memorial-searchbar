function createFilter(label, onToggle) {
	const container = document.createElement("label");
	container.classList.add("filter");

	const checkbox = document.createElement("input");
	checkbox.setAttribute("type", "checkbox");
	checkbox.addEventListener("change", function(event) {
		onToggle(event.target.checked, label);
	});
	container.appendChild(checkbox);

	const span = document.createElement("span");
	span.appendChild(document.createTextNode(label));
	container.appendChild(span);

	return container;
}


function mountExampleFilters({mountTo, onToggle, filters}) {
	for (const [label, _] of filters) {
		mountTo.appendChild(createFilter(label, onToggle));
	}
}


export default mountExampleFilters;
