import template from "./template.mjs";
import Database from "./database.mjs";

class ToProvider extends HTMLElement {
    #db;
    #store = { // current
        category: null, // movie or show
        pointer: null,
        time: null,
        volume: null
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

    async connectedCallback() {
        this.#db = await new Database("Library");
        this.#createStore();
        this.#connect();
    }

    async #createStore() {
        this.#store = localStorage.getItem('store') ? JSON.parse(localStorage.getItem('store')) : this.#store;

        this.#theaterComponent.render(this.#store, await this.#selection);
        this.#moviesComponent.render(this.#store, await this.#movies);
        this.#showsComponent.render(this.#store, await this.#shows);
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

    async refreshLibrary() {
        const response = await fetch('https://dns.thonly.net:444/');
        const data = await response.json();
    
        const movies = this.#db.getObjectStore("movies", 'readwrite');
        const shows = this.#db.getObjectStore("shows", 'readwrite');

        Object.keys(data.movies).forEach(genre => data.movies[genre].forEach(movie => this.#db.updateEntry(movies, { genre, ...movie })));
        Object.keys(data.shows).forEach(show => data.shows[show].forEach(season => this.#db.updateEntry(shows, { show, ...season })));
    }

    get #selection() {
        return (async () => {
            if (this.#store.pointer) return await this.#db.getEntry(this.#db.getObjectStore(this.#store.category, 'readonly'), this.#store.pointer);
            return null;
        })();
    }

    get #movies() {
        return (async () => await this.#db.getAllEntries(this.#db.getObjectStore("movies", 'readonly')))();
    }

    get #shows() {
        return (async () => await this.#db.getAllEntries(this.#db.getObjectStore("shows", 'readonly')))();
    }

    async test() {
        const movies = this.#db.getObjectStore("movies", 'readwrite');
        console.log(await this.#db.addEntry(movies, {id: "1", title: "Avatar"}));
        console.log(await this.#db.addEntry(movies, {id: "2", title: "Avatar"}));
        console.log(await this.#db.updateEntry(movies, {id: "3", title: "Avatar 2"}));
        console.log(await this.#db.getEntry(movies, "2"));
        console.log(await this.#db.searchForEntry(movies, "title", "Avatar"));
        console.log(await this.#db.searchForEntries(movies, "title", "Avatar 2", "nextunique"));
        console.log(await this.#db.getCount(movies));
        console.log(await this.#db.getAllEntries(movies));
        console.log(await this.#db.getEntries(movies));
        console.log(await this.#db.deleteEntry(movies, "1"));
        console.log(await this.#db.clearObjectStore(movies));
    }

    test2() {
        const movies = this.#db.getObjectStore("movies", 'readwrite');
        this.#db.addEntry(movies, {id: "1", title: "Avatar"}, event => console.log(event));
        this.#db.addEntry(movies, {id: "2", title: "Avatar"}, console.log);
        this.#db.updateEntry(movies, {id: "3", title: "Avatar 2"}, console.log);
        this.#db.getEntry(movies, "2", console.log);
        this.#db.searchForEntry(movies, "title", "Avatar", console.log);
        this.#db.searchForEntries(movies, "title", "Avatar 2", console.log, "nextunique");
        this.#db.getCount(movies, console.log);
        this.#db.getAllEntries(movies, console.log);
        this.#db.getEntries(movies, console.log);
        this.#db.deleteEntry(movies, "1", console.log);
        this.#db.clearObjectStore(movies, console.log);
    }
}

customElements.define("to-provider", ToProvider);