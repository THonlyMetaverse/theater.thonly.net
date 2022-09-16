import template from "./template.mjs";

class ToMovies extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, movies) {
        console.log(movies)
    }

    #dispatch(selection) {
        this.dispatchEvent(new CustomEvent("to-movies", { bubbles: true, composed: true, detail: { action: "selection", data: {selection} }}));
    }

    #reorder(movies) {
        const data = [[], []];
        movies.forEach(movie => {
            if (data[movie.genre]) {
                data[movie.genre].push()
            } else {
                data.push([movie.genre]);
            }
        });
    }
}

customElements.define("to-movies", ToMovies);