import template from "./template.mjs";

class ToShows extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, shows) {
        //console.log(shows)
        //this.#renderSelection(store, shows);
        this.#renderCollection(store, shows);
    }

    #renderSelection(store, shows) {
        const season = store.selection || shows[0][0];
        const aside = this.shadowRoot.querySelector('aside');
        aside.replaceChildren();

        const p = document.createElement('p');
        p.textContent = `${season.title} (${season.year})`;
        aside.append(p);
    }

    #renderCollection(store, shows) {
        const fragment = document.createDocumentFragment();

        shows.forEach(show => {
            const h3 = document.createElement('h3');
            if (show[0]) h3.append(show[0].show);
            const menu = document.createElement('menu');

            show.forEach(season => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                const a = document.createElement('a');
                img.src = season.poster;
                img.onclick = () => this.#dispatch(season);
                a.textContent = `${season.title} (${season.year})`;
                a.href = season.wikipedia;
                a.target = "_blank";
                li.append(img, a);
                menu.append(li);
            });

            fragment.append(h3, menu);
        });

        const nav = this.shadowRoot.querySelector('nav');
        nav.replaceChildren(fragment);
    }

    #dispatch(selection) {
        this.dispatchEvent(new CustomEvent("to-shows", { bubbles: true, composed: true, detail: { action: "selection", data: {selection} }}));
    }
}

customElements.define("to-shows", ToShows);