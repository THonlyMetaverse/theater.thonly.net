import template from "./template.mjs";

class ToShows extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, shows) {
        //console.log(shows)
        this.renderSelection(store.selection || shows[0][0], store.counter);
        this.#renderCollection(shows);
    }

    renderSelection(season, episode) {
        const fragment = document.createDocumentFragment();

        const a = document.createElement('a');
        const select = document.createElement('select');
        fragment.append(a, document.createElement('br'), document.createElement('br'), select);

        a.textContent = `${season.title} (${season.year})`;
        a.href = season.wikipedia;
        a.target = "_blank";

        select.onchange = () => this.#dispatch(season, parseInt(select.value));

        for (let number = 1; number <= season.episodes; number++) {
            const option = document.createElement('option');
            option.value = number;
            option.textContent = "Episode " + number;
            option.selected = number === episode;
            select.append(option);
        }

        this.shadowRoot.querySelector('aside').replaceChildren(fragment);
    }

    #renderCollection(shows) {
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
                img.onclick = () => this.#dispatch(season, 1);
                a.textContent = `${season.title} (${season.year})`;
                a.href = season.series;
                a.target = "_blank";
                li.append(img, a);
                menu.append(li);
            });

            fragment.append(h3, menu);
        });

        this.shadowRoot.querySelector('nav').replaceChildren(fragment);
    }

    #dispatch(selection, episode) {
        this.dispatchEvent(new CustomEvent("to-shows", { bubbles: true, composed: true, detail: { action: "selection", data: { selection, episode } }}));
    }
}

customElements.define("to-shows", ToShows);