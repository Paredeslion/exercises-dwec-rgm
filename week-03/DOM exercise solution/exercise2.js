/*****
 * DOM - Exercise 2
 * 
 * When a user clicks on a div inside the div.container element, add or remove (toggle) the "selected" CSS class,
 * but this time, ONLY 1 div can have the "selected" class activated (remove from other div elements if necessary)
 * 
 * The button#insert-before element will create a NEW div with the text in the input#text element 
 * (don't forget the click event on the new div) before the selected div or at the beginning of 
 * the div.container if none is selected
 * 
 * The button#insert-after element will do the same but add it AFTER the selected div or at the end
 * of the div.container if none is selected
 * 
 * The button#replace elemente will create a NEW DIV with the corresponding text and replace the selected div
 * with it. If none is selected do nothing.
 * 
 * The button#delete elemente will delete the selected div (do nothing if none is selected).
 * 
 * The button#clear elemente will remove everything inside the div.container element.
 * 
 * DON'T USE innerHTML!!!!
 */

function divClick(e) {
    const selected = document.querySelector(".container > div.selected");
    if(selected && selected !== this) {
        selected.classList.remove("selected");
    }
    this.classList.toggle("selected");
}

const container = document.querySelector(".container");
const input = document.getElementById("text");
const btnInsertBefore = document.getElementById("insert-before");
const btnInsertAfter = document.getElementById("insert-after");
const btnReplace = document.getElementById("replace");
const btnDelete = document.getElementById("delete");
const btnClear = document.getElementById("clear");

container.querySelectorAll("div").forEach(div => {
    div.addEventListener("click", divClick);
});

function createDiv(text) {
    const div = document.createElement("div");
    div.textContent = text;
    div.addEventListener("click", divClick);
    return div;
}

btnInsertBefore.addEventListener("click", e => {
    const div = createDiv(input.value);
    const selected = document.querySelector("div.selected");
    if(selected) {
        selected.before(div);
    } else {
        container.prepend(div);
    }
});

btnInsertAfter.addEventListener("click", e => {
    const div = createDiv(input.value);
    const selected = document.querySelector("div.selected");
    if(selected) {
        selected.after(div);
    } else {
        container.append(div);
    }
});

btnReplace.addEventListener("click", e => {
    const div = createDiv(input.value);
    const selected = document.querySelector("div.selected");
    if(selected) {
        selected.replaceWith(div);
    }
});

btnDelete.addEventListener("click", e => {
    const div = createDiv(input.value);
    const selected = document.querySelector("div.selected");
    if(selected) {
        selected.remove();
    }
});

btnClear.addEventListener("click", e => {
    container.replaceChildren();
});