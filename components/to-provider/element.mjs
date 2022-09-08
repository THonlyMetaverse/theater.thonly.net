import template from "./template.mjs";

class ToProvider extends HTMLElement {
    #store = {
        current: {
            category: null, //movie or show
            pointer: null,
            time: null,
            volume: null
        },
        movies: [],
        shows: []
    };

    #theaterComponent;
    #moviesComponent;
    #showsComponent;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.#theaterComponent = this.querySelector('to-theater');
        this.#moviesComponent = this.querySelector('to-movies');
        this.#showsComponent = this.querySelector('to-shows');
    }

    async refreshLibrary() {
        const response = await fetch('https://dns.thonly.net:444/');
        const data = await response.json();
        this.#store.current = {};
        this.#store.movies = data.movies;
        this.#store.shows = data.shows;

        console.log(this.#store);
        localStorage.setItem('store', JSON.stringify(this.#store));
        this.#createDatabase();
    }

    connectedCallback() {
        this.#createStore();
        this.#connect();
    }

    #createStore() {
        this.#store = localStorage.getItem('store') ? JSON.parse(localStorage.getItem('store')) : this.#store;

        this.#theaterComponent.render(this.#store);
        this.#moviesComponent.render(this.#store);
        this.#showsComponent.render(this.#store);
    }

    #connect() {
        this.#theaterComponent.addEventListener('to-theater', event => this.#reducers("theater", event.detail.action, event.detail.data));
        this.#theaterComponent.addEventListener('to-movies', event => this.#reducers("movies", event.detail.action, event.detail.data));
        this.#theaterComponent.addEventListener('to-shows', event => this.#reducers("shows", event.detail.action, event.detail.data));
    }

    #reducers(component, action, data) {
        this.#middleware();

        switch(component) {
            case "theater":
                switch (action) {
                    case "previous":
                        break;
                    case "next":
                        break;
                    case "time":
                        break;
                    case "volume":
                        break;
                }
                break;
            case "movies":
                switch (action) {
                    case "selection":
                        break;
                }
                break;
            case "shows":
                switch (action) {
                    case "selection":
                        break;
                }
                break;
        }

        localStorage.setItem('store', JSON.stringify(this.#store));
    }

    #middleware() {}

    #createDatabase() {
        const request = indexedDB.open("MyTestDatabase");

        request.onerror = (event) => {
            console.error("Why didn't you allow my web app to use IndexedDB?!");
        };

        request.onsuccess = (event) => {
            console.log(event.target.result);
        };
    }
}

customElements.define("to-provider", ToProvider);