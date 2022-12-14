import template from "./template.mjs";

class ToMovies extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, movies) {
        //console.log(movies)
        //this.#renderSelection(store, movies);
        this.#renderCollection(store, movies);
    }

    #renderSelection(store, movies) {
        const movie = store.selection || movies[0][0];
        const aside = this.shadowRoot.querySelector('aside');
        aside.replaceChildren();

        const p = document.createElement('p');
        p.textContent = `${movie.title} (${movie.year})`;
        aside.append(p);
    }

    // TODO: later highlight selected movie ?
    #renderCollection(store, movies) {
        const fragment = document.createDocumentFragment();

        movies.forEach((genre, g) => {
            const h3 = document.createElement('h3');
            h3.append(genre[0].genre);
            const menu = document.createElement('menu');

            genre.forEach((movie, m) => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                const a = document.createElement('a');
                img.src = movie.poster;
                img.onclick = () => this.#dispatch(movie, [g, m]);
                a.textContent = `${movie.title} (${movie.year})`;
                a.href = movie.wikipedia;
                a.target = "_blank";
                li.append(img, a);
                menu.append(li);
            });

            fragment.append(h3, menu);
        });

        this.shadowRoot.querySelector('nav').replaceChildren(fragment);
    }

    #dispatch(selection, pointer) {
        this.dispatchEvent(new CustomEvent("to-movies", { bubbles: true, composed: true, detail: { action: "selection", data: {selection, pointer} }}));
    }
}

customElements.define("to-movies", ToMovies);