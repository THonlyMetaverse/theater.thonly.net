//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

export default class {
    db;

    constructor(name, version=1) {
        const req = indexedDB.open(name, version);
        req.onerror = event => console.error(event.target.error);
        req.onsuccess = event => this.db = event.target.result;

        req.onupgradeneeded = event => {
            this.db = event.target.result;

            const movies = this.db.createObjectStore("movies", { keyPath: 'id' });
            movies.createIndex('title', 'title', { unique: false });
            movies.createIndex('year', 'year', { unique: false });
            
            const shows = this.db.createObjectStore("shows", { keyPath: 'id' });
            shows.createIndex('title', 'title', { unique: false });
            shows.createIndex('year', 'year', { unique: false });
        };
    }

    getObjectStore(name, mode) { // mode = readwrite, readonly = more performant
        const transaction = this.db.transaction(name, mode);
        return transaction.objectStore(name);
    }

    getObjectStores(names, mode) {
        const transaction = this.db.transaction(names, mode);
        return names.map(name => transaction.objectStore(name));
    }

    addEntry(store, entry, callback=console.log) {
        const req = store.add(entry); 
        req.onsuccess = event => callback(event.target.result); // returns key
        req.onerror = event => console.error(event.target.error); // cannot update
    }

    updateEntry(store, entry, callback=console.log) {
        const req = store.put(entry);
        req.onsuccess = event => callback(event.target.result); // can add too! => returns key
        req.onerror = event => console.error(event.target.error);
    }

    getCount(store, callback=console.log) {
        const req = store.count();
        req.onsuccess = event => callback(event.target.result);
        req.onerror = event => console.error(event.target.error);
    }

    getEntry(store, key, callback=console.log) {
        const req = store.get(key); 
        req.onsuccess = event => callback(event.target.result); // if no key => undefined
        req.onerror = event => console.error(event.target.error);
    }

    // more performant
    searchForEntry(store, property, value, callback=console.log) {
        const req = store.index(property).get(value); // if multiple => lowest key
        req.onsuccess = event => callback(event.target.result); // if none => undefined
        req.onerror = event => console.error(event.target.error);
    }

    getAllEntries(store, callback=console.log) {
        const req = store.getAll(); 
        req.onsuccess = event => callback(event.target.result); // array of entries
        req.onerror = event => console.error(event.target.error);
    }

    getRange({ lowerBound, upperBound }) {
        if (lowerBound && upperBound) return IDBKeyRange.bound(lowerBound.value, upperBound.value, !lowerBound.include, !upperBound.include)
        else if (lowerBound) return IDBKeyRange.lowerBound(lowerBound.value, !lowerBound.include)
        else if (upperBound) return IDBKeyRange.upperBound(upperBound.value, !upperBound.include)
        else return null;
    }

    // more efficient
    getEntries(store, callback=console.log, range=null, direction="next") {
        const req = store.openCursor(range, direction); // direction: next, prev // nextunique, prevunique => lowest key
        req.onerror = event => console.error(event.target.error);

        req.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                const entry = store.get(cursor.key);
                entry.onerror = event => console.error(event.target.error);

                entry.onsuccess = event => {
                    callback(event.target.result);   
                    cursor.continue();
                };
            } else console.log("No more entries");
        };
    }

    // more performant
    searchForEntries(store, property, value, callback=console.log, direction="next") {
        const req = store.index(property).openCursor(IDBKeyRange.only(value), direction); // can also use openKeyCursor() => key property
        req.onerror = event => console.error(event.target.error);

        req.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                callback(cursor.value);   
                cursor.continue();
            } else console.log("No more entries");
        };
    }
    
    deleteEntry(store, key, callback=console.log) {
        const req = store.delete(key); 
        req.onsuccess = event => callback(event.type); // okay even if no key exists => success
        req.onerror = event => console.error(event.target.error);
    }

    clearObjectStore(store, callback=console.log) {
        const req = store.clear(); 
        req.onsuccess = event => callback(event.type); // all entries are deleted => success
        req.onerror = event => console.error(event.target.error);
    }
}