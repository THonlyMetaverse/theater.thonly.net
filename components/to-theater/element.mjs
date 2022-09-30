import template from "./template.mjs";

class ToTheater extends HTMLElement {
    #video;
    #origin = window.location.hostname === "theater.thonly.net" ? "https://dns.thonly.net:444/" : "";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.#video = this.shadowRoot.querySelector('video');
    }

    connectedCallback() {
        this.#video.addEventListener('loadedmetadata', event => this.dispatch('load', event));
        this.#video.addEventListener('volumechange', event => this.dispatch('volume', event));
        this.#video.addEventListener('timeupdate', event => this.dispatch('time', event));
        this.#video.addEventListener('ended', event => this.dispatch('next', event));
    }

    render({ selection, counter }) {
        switch (selection.category) {
            case "movies":
                this.#video.poster = selection.poster;
                this.#video.src = this.#origin + selection.film;
                if (selection.english) this.#video.firstElementChild.src = selection.english;
                break;
            case "shows":
                this.#video.poster = selection.poster;
                this.#video.src = this.#origin + `${selection.path}/${counter}.mp4`;
                //console.log(counter)
                break;
        }
    }

    set init({ time, volume, muted }) {
        this.#video.currentTime = time;
        this.#video.volume = volume;
        this.#video.muted = muted;
    }

    dispatch(action, event) {
        //console.log(event)
        const data = {};

        switch (action) {
            case "load":
                data.event = event;
                break;
            case "next":
                data.event = event;
                break;
            case "previous":
                data.event = event;
                break;
            case "time":
                data.time = event.currentTarget.currentTime;
                break;
            case "volume":
                data.volume = event.currentTarget.volume;
                data.muted = event.currentTarget.muted;
                break;  
        }
        
        this.dispatchEvent(new CustomEvent("to-theater", { bubbles: true, composed: true, detail: { action, data }}));
    }
}

customElements.define("to-theater", ToTheater);

// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video
// https://atelier.u-sub.net/srt2vtt/