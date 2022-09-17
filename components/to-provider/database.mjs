//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

export default class {    
    db;

    constructor(name, keyPath=null, stores=null, indexes=null, version=1) {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(name, version);
            req.oncomplete = event => resolve(this);
            req.onerror = event => reject(event.target.error);

            req.onsuccess = event => {
                this.db = event.target.result;
                resolve(this);
            };
    
            req.onupgradeneeded = event => {
                this.db = event.target.result;
                stores.forEach(store => {
                    const objectStore = this.db.createObjectStore(store, { keyPath });
                    indexes.forEach(index => objectStore.createIndex(index, index, { unique: false }));
                });  
            };
        });
    }

    getObjectStore(name, mode) { // mode = readwrite, readonly = more performant
        const transaction = this.db.transaction(name, mode);
        return transaction.objectStore(name);
    }

    getObjectStores(names, mode) {
        const transaction = this.db.transaction(names, mode);
        return names.map(name => transaction.objectStore(name));
    }

    addEntry(store, entry) {
        return new Promise((resolve, reject) => {
            const req = store.add(entry); 
            req.onsuccess = event => resolve(event.target.result); // returns key
            req.onerror = event => reject(event.target.error); // cannot update
        });
    }

    updateEntry(store, entry) {
        return new Promise((resolve, reject) => {
            const req = store.put(entry);
            req.onsuccess = event => resolve(event.target.result); // can add too! => returns key
            req.onerror = event => reject(event.target.error);
        });
    }

    getCount(store) {
        return new Promise((resolve, reject) => {
            const req = store.count();
            req.onsuccess = event => resolve(event.target.result);
            req.onerror = event => reject(event.target.error);
        });
    }

    // efficient
    getEntry(store, key) {
        return new Promise((resolve, reject) => {
            const req = store.get(key); 
            req.onsuccess = event => resolve(event.target.result); // if no key => undefined
            req.onerror = event => reject(event.target.error);
        });
    }

    // performant
    searchForEntry(store, property, value) {
        return new Promise((resolve, reject) => {
            const req = store.index(property).get(value); // if multiple => lowest key
            req.onsuccess = event => resolve(event.target.result); // if none => undefined
            req.onerror = event => reject(event.target.error);
        });
    }

    getAllEntries(store) {
        return new Promise((resolve, reject) => {
            const req = store.getAll(); 
            req.onsuccess = event => resolve(event.target.result); // array of entries
            req.onerror = event => reject(event.target.error);
        });
    }

    // more performant
    getAllEntriesViaIndex(store, property, direction="next") {
        return new Promise((resolve, reject) => {
            const entries = []; 
            const req = store.index(property).openCursor(null, direction);
            req.onerror = event => reject(event.target.error);

            req.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    entries.push(cursor.value);   
                    cursor.continue();
                } else resolve(entries);
            };
        });
    }

    getRange({ lowerBound, upperBound }) {
        if (lowerBound && upperBound) return IDBKeyRange.bound(lowerBound.value, upperBound.value, !lowerBound.include, !upperBound.include)
        else if (lowerBound) return IDBKeyRange.lowerBound(lowerBound.value, !lowerBound.include)
        else if (upperBound) return IDBKeyRange.upperBound(upperBound.value, !upperBound.include)
        else return null;
    }

    // efficient
    searchForEntries(store, range=null, direction="next") {
        return new Promise((resolve, reject) => {
            const entries = []; 
            const req = store.openCursor(range, direction); // direction: next, prev // nextunique, prevunique => lowest key
            req.onerror = event => reject(event.target.error);

            req.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    const entry = store.get(cursor.key);
                    entry.onerror = event => reject(event.target.error);

                    entry.onsuccess = event => {
                        entries.push(event.target.result);
                        cursor.continue();
                    };
                } else resolve(entries);
            };
        });
    }

    // more performant
    searchForEntriesViaIndex(store, property, value, direction="next") {
        return new Promise((resolve, reject) => {
            const entries = []; 
            const req = store.index(property).openCursor(IDBKeyRange.only(value), direction); // can also use openKeyCursor() => key property
            req.onerror = event => reject(event.target.error);

            req.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    entries.push(cursor.value);   
                    cursor.continue();
                } else resolve(entries);
            };
        });
    }
    
    deleteEntry(store, key) {
        return new Promise((resolve, reject) => {
            const req = store.delete(key); 
            req.onsuccess = event => resolve(event.type); // okay even if no key exists => success
            req.onerror = event => reject(event.target.error);
        });
    }

    clearObjectStore(store) {
        return new Promise((resolve, reject) => {
            const req = store.clear(); 
            req.onsuccess = event => resolve(event.type); // all entries are deleted => success
            req.onerror = event => reject(event.target.error);
        });
    }
}