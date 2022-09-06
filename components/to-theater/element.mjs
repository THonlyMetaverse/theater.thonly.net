import template from "./template.mjs";

class SwMedia extends HTMLElement {
    #url;
    #anchor;
    #image;
    #audio;
    #video;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#url = this.shadowRoot.querySelector('input');
        this.#anchor = this.shadowRoot.querySelector('a');
        this.#image = this.shadowRoot.querySelector('img');
        this.#audio = this.shadowRoot.querySelector('audio');
        this.#video = this.shadowRoot.querySelector('video');
    }

    update(media) {
        this.#image.style.display = 'none';
        this.#audio.style.display = 'none';
        this.#video.style.display = 'none';
        this.#url.value = media.url;
        this.#anchor.href = media.path;
        this.#anchor.download = media.name;
    
        switch (media.category) {
            case "Images": 
                this.#image.src = media.path;
                this.#image.style.display = 'block';
                break;
            case "Sounds":
                this.#audio.src = media.path;
                this.#audio.style.display = 'block';
                break;
            case "Videos":
                this.#video.src = media.path;
                this.#video.style.display = 'block';
                break;
        }
    }

    async copyUrl() {
        await navigator.clipboard.writeText(this.#url.value);
        this.#url.focus();
    }
}

customElements.define("sw-media", SwMedia);