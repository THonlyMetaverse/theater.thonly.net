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
        this.addEventListener('loadedmetadata', event => this.dispatch('load', event));
        this.addEventListener('volumechange', event => this.dispatch('volume', event));
        this.addEventListener('timeupdate', event => this.dispatch('time', event));
        this.addEventListener('ended', event => this.dispatch('next', event));
    }

    render(store) {
        this.play(store.selection);
    }

    play(selection) {
        switch (selection.category) {
            case "movies":
                this.#video.poster = selection.poster;
                this.#video.src = selection.film;
                if (selection.english) this.#video.firstElementChild.src = selection.english;
                break;
            case "shows":
                break;
        }
    }

    #dispatch(action, event) {
        switch (action) {
            case "load":
                break;
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

// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
// https://atelier.u-sub.net/srt2vtt/