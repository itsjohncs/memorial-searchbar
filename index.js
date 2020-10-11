import generateRandomGallery from "./generateRandomGallery";
import setupSearch from "./setupSearch";

const filters = [
    ["Under 18", "age: 0-18"],
    ["Police Involved", "involved: on-duty-police, off-duty-police"],
];

const gallery = document.getElementById("gallery");
generateRandomGallery(gallery, 50);
setupSearch(
    document.getElementById("gallery"),
    document.getElementsByClassName("search")[0],
    filters);
