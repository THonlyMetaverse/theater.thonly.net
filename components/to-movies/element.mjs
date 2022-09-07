import template from "./template.mjs";

class ToMovies extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render() {

    }

    #dispatch(selection) {
        this.dispatchEvent(new CustomEvent("to-movies", { bubbles: true, composed: true, detail: { action: "selection", data: {selection} }}));
    }

    #orderByName(a, b) {
        const titleA = a.name.toUpperCase();
        const titleB = b.name.toUpperCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    }
}

customElements.define("to-movies", ToMovies);