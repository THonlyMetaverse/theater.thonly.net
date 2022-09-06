import template from "./template.mjs";

class ToBody extends HTMLElement {
    #theaterElement;
    #libraryElement;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#theaterElement = this.querySelector('to-theater');
        this.#libraryElement = this.querySelector('to-library');
    }

    connectedCallback() {
        
    }

    
}

customElements.define("to-body", ToBody);