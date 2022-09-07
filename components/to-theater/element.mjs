import template from "./template.mjs";

class ToTheater extends HTMLElement {
    #video;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#video = this.shadowRoot.querySelector('video');
    }

    connectedCallback() {
        this.addEventListener('volumechange', event => this.dispatch('volume', event));
        this.addEventListener('timeupdate', event => this.dispatch('time', event));
        this.addEventListener('ended', event => this.dispatch('next', event));
    }

    render(store) {

    }

    play(selection) {

    }

    dispatch(action, event) {
        switch (action) {
            case "next":
                break;
            case "previous":
                break;
            case "time":
                break;
            case "volume":
                break;  
        }

        this.dispatchEvent(new CustomEvent("to-theater", { bubbles: true, composed: true, detail: { action, data: {} }}));
    }
}

customElements.define("to-theater", ToTheater);