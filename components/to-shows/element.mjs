import template from "./template.mjs";

class ToShows extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(store, shows) {
        console.log(shows)
        const nav = this.shadowRoot.querySelector('nav');
        nav.replaceChildren();

        shows.forEach(show => {
            const h3 = document.createElement('h3');
            if (show[0]) h3.append(show[0].show);
            const menu = document.createElement('menu');

            show.forEach(season => {
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = season.poster;
                li.append(img, " ", season.title);
                menu.append(li);
            });

            nav.append(h3, menu);
        });
    }

    #dispatch(selection) {
        this.dispatchEvent(new CustomEvent("to-shows", { bubbles: true, composed: true, detail: { action: "selection", data: {selection} }}));
    }
}

customElements.define("to-shows", ToShows);