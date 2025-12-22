/*****
 * DOM - Exercise 1
 * 
 * When a user clicks on a div inside the div.container element, add or remove (toggle) the "selected" CSS class
 * The button#delete element will remove all selected divs from the DOM
 */

document.querySelectorAll(".container > div").forEach(div => {
    div.addEventListener("click", e => {
        div.classList.toggle("selected");
    });
});

document.getElementById("delete").addEventListener("click", e => {
    document.querySelectorAll(".container > div.selected").forEach(div => div.remove());
});