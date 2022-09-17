import template from "./template.mjs";

class ToMovies extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, movies) {
        console.log(movies)
        const nav = this.shadowRoot.querySelector('nav');
        nav.replaceChildren();

        movies.forEach(genre => {
            const h3 = document.createElement('h3');
            h3.append(genre[0].genre);
            const menu = document.createElement('menu');

            genre.forEach(movie => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = movie.poster;
                li.append(img, " ", movie.title);
                menu.append(li);
            });

            nav.append(h3, menu);
        });
    }

    #dispatch(selection) {
        this.dispatchEvent(new CustomEvent("to-movies", { bubbles: true, composed: true, detail: { action: "selection", data: {selection} }}));
    }
}

customElements.define("to-movies", ToMovies);