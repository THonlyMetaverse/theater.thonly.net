import template from "./template.mjs";
import Database from "./database.mjs";

class ToProvider extends HTMLElement {
    #Movies;
    #Shows;
    #store = {
        selection: null,
        counter: null, // movie = [genre, movie] / episode = 1
        time: 0, // seconds
        volume: 1, // percent
        muted: false
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
        if (databases.length === 0) {
            this.refreshLibrary();
        } else {
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
        const movies = await this.#movies;
        const shows = await this.#shows;
        this.#store.selection = this.#store.selection || movies[0][0];

        this.#theaterComponent.render(this.#store);
        this.#moviesComponent.render(this.#store, movies);
        this.#showsComponent.render(this.#store, shows);
    }

    async #reducers(component, { action, data }) {
        this.#middleware();

        switch(component) {
            case "theater":
                switch (action) {
                    case "load":
                        //console.log(data.event);
                        this.#theaterComponent.init = this.#store;
                        break;
                    case "previous":
                        if (this.#store.selection.category === "movies") {
                            const movies = await this.#movies;
                            this.#store.counter[1] -= 1;
                            if (this.#store.counter[1] === -1) this.#store.counter[1] = movies[this.#store.counter[0]].length - 1;
                            this.#store.selection = movies[this.#store.counter[0]][this.#store.counter[1]];
                        } else if (this.#store.selection.category === "shows") {
                            this.#store.counter -= 1;
                            if (this.#store.counter === 0) this.#store.counter = this.#store.selection.episodes; // TODO: go to next season? ep 1
                            this.#showsComponent.renderSelection(this.#store.selection, this.#store.counter);
                        }
                        this.#store.time = 0;
                        this.#theaterComponent.render(this.#store);
                        break;
                    case "next":
                        if (this.#store.selection.category === "movies") {
                            const movies = await this.#movies;
                            this.#store.counter[1] += 1;
                            if (this.#store.counter[1] === movies[this.#store.counter[0]].length) this.#store.counter[1] = 0;
                            this.#store.selection = movies[this.#store.counter[0]][this.#store.counter[1]];
                        } else if (this.#store.selection.category === "shows") {
                            this.#store.counter += 1;
                            if (this.#store.counter === this.#store.selection.episodes + 1) this.#store.counter = 1; // TODO: go to next season? ep 1
                            this.#showsComponent.renderSelection(this.#store.selection, this.#store.counter);
                        }
                        this.#store.time = 0;
                        this.#theaterComponent.render(this.#store);
                        break;
                    case "time":
                        this.#store.time = data.time;
                        break;
                    case "volume":
                        this.#store.volume = data.volume;
                        this.#store.muted = data.muted;
                        break;
                }
                break;
            case "movies":
                switch (action) {
                    case "selection":
                        this.#store.selection = data.selection;
                        this.#store.counter = data.pointer;
                        this.#store.time = 0;
                        this.#store.volume = 1;
                        this.#store.muted = false;
                        this.#theaterComponent.render(this.#store);
                        this.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
                        break;
                }
                break;
            case "shows":
                switch (action) {
                    case "selection":
                        this.#store.selection = data.selection;
                        this.#store.counter = data.episode;
                        this.#store.time = 0;
                        this.#store.volume = 1;
                        this.#store.muted = false;
                        this.#theaterComponent.render(this.#store);
                        this.#showsComponent.renderSelection(this.#store.selection, this.#store.counter);
                        this.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
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
            data.movies[genre].forEach(movie => this.#Movies.updateEntry(this.#Movies.getObjectStore(genre, 'readwrite'), { category: "movies", genre, ...movie }));
        }

        for (let show of this.#Shows.db.objectStoreNames) {
            data.shows[show].forEach(season => this.#Shows.updateEntry(this.#Shows.getObjectStore(show, 'readwrite'), { category: "shows", show, ...season }));
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