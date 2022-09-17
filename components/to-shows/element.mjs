import template from "./template.mjs";

class ToShows extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, shows) {
        console.log(shows)
    }

    #dispatch(selection) {
        this.dispatchEvent(new CustomEvent("to-shows", { bubbles: true, composed: true, detail: { action: "selection", data: {selection} }}));
    }

    #orderByName(a, b) {
        const titleA = a.name.toUpperCase();
        const titleB = b.name.toUpperCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    }
}

customElements.define("to-shows", ToShows);