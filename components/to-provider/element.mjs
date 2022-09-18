import template from "./template.mjs";
import Database from "./database.mjs";

class ToProvider extends HTMLElement {
    #Movies;
    #Shows;
    #store = {
        selection: null,
        counter: null, // current movie or episode
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
        this.#connect();
        const databases = await indexedDB.databases();
        if (databases.length !== 0) {
            this.#Movies = await new Database(databases[0].name);
            this.#Shows = await new Database(databases[1].name);
            this.#createStore();
        }
    }

    #connect() {
        this.addEventListener('to-theater', event => this.#reducers("theater", event.detail));
        this.addEventListener('to-movies', event => this.#reducers("movies", event.detail));
        this.addEventListener('to-shows', event => this.#reducers("shows", event.detail));
    }

    async #createStore() {
        this.#store = localStorage.getItem('store') ? JSON.parse(localStorage.getItem('store')) : this.#store;

        this.#theaterComponent.render(this.#store);
        this.#moviesComponent.render(this.#store, await this.#movies);
        this.#showsComponent.render(this.#store, await this.#shows);
    }

    #reducers(component, { action, data }) {
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
                        console.log(data.selection)
                        break;
                }
                break;
            case "shows":
                switch (action) {
                    case "selection":
                        console.log(data.selection)
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

        this.#Movies = await new Database("Movies", "id", Object.keys(data.movies), ["title", "year"]);
        this.#Shows = await new Database("Shows", "id", Object.keys(data.shows), ["title", "year"]);

        for (let genre of this.#Movies.db.objectStoreNames) {
            data.movies[genre].forEach(movie => this.#Movies.updateEntry(this.#Movies.getObjectStore(genre, 'readwrite'), { genre, ...movie }));
        }

        for (let show of this.#Shows.db.objectStoreNames) {
            data.shows[show].forEach(season => this.#Shows.updateEntry(this.#Shows.getObjectStore(show, 'readwrite'), { show, ...season }));
        }   
        
        this.#createStore();
    }

    // deprecated
    get #selection() {
        return (async () => {
            if (this.#store.id) return this.#store.database === "movies" ? await this.#Movies.getEntry(this.#Movies.getObjectStore(this.#store.store, 'readonly'), this.#store.id) : await this.#Shows.getEntry(this.#Shows.getObjectStore(this.#store.store, 'readonly'), this.#store.id);
            return null;
        })();
    }

    get #movies() {
        return (async () => {
            const movies = [];
            [...this.#Movies.db.objectStoreNames].sort().forEach(genre => {
                movies.push(this.#Movies.getAllEntriesViaIndex(this.#Movies.getObjectStore(genre, 'readonly'), "title"));
            });
            return (await Promise.allSettled(movies)).map(collection => collection.value);
        })();
    }

    get #shows() {
        return (async () => {
            const shows = [];
            [...this.#Shows.db.objectStoreNames].sort().forEach(show => {
                shows.push(this.#Shows.getAllEntriesViaIndex(this.#Shows.getObjectStore(show, 'readonly'), "title"));
            });
            return (await Promise.allSettled(shows)).map(collection => collection.value);
        })();
    }

    async test() {
        const movies = this.#Movies.getObjectStore("Anime", 'readwrite');
        console.log(await this.#Movies.addEntry(movies, {id: "1", title: "Avatar"}));
        console.log(await this.#Movies.addEntry(movies, {id: "2", title: "Avatar"}));
        console.log(await this.#Movies.updateEntry(movies, {id: "3", title: "Avatar 2"}));
        console.log(await this.#Movies.getEntry(movies, "2"));
        console.log(await this.#Movies.searchForEntry(movies, "title", "Avatar"));
        console.log(await this.#Movies.searchForEntries(movies, "title", "Avatar 2", "nextunique"));
        console.log(await this.#Movies.getCount(movies));
        console.log(await this.#Movies.getAllEntries(movies));
        console.log(await this.#Movies.getEntries(movies));
        console.log(await this.#Movies.deleteEntry(movies, "1"));
        console.log(await this.#Movies.clearObjectStore(movies));
    }

    // deprecated
    test2() {
        const movies = this.#Movies.getObjectStore("Anime", 'readwrite');
        this.#Movies.addEntry(movies, {id: "1", title: "Avatar"}, event => console.log(event));
        this.#Movies.addEntry(movies, {id: "2", title: "Avatar"}, console.log);
        this.#Movies.updateEntry(movies, {id: "3", title: "Avatar 2"}, console.log);
        this.#Movies.getEntry(movies, "2", console.log);
        this.#Movies.searchForEntry(movies, "title", "Avatar", console.log);
        this.#Movies.searchForEntries(movies, "title", "Avatar 2", console.log, "nextunique");
        this.#Movies.getCount(movies, console.log);
        this.#Movies.getAllEntries(movies, console.log);
        this.#Movies.getEntries(movies, console.log);
        this.#Movies.deleteEntry(movies, "1", console.log);
        this.#Movies.clearObjectStore(movies, console.log);
    }
}

customElements.define("to-provider", ToProvider);