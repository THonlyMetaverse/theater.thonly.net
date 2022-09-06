import template from "./template.mjs";
// https://unicode.org/emoji/charts/full-emoji-list.html#1f4fc

class SwLibrary extends HTMLElement {
    #categories = ['Images', 'Sounds', 'Videos'];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    emitRefresh() {
        this.dispatchEvent(new CustomEvent("sw-library", { bubbles: true, composed: true, detail: { action: "refresh" }}));
    }

    async refresh() {
        const response = await fetch('https://dns.siliconwat.com:528/');
        const data = await response.json();
        this.render(data.library);
        return data.library;
        //document.location.reload();
    }

    async #remove(path) {
        const response = await fetch('https://dns.siliconwat.com:528/', {
            method: "DELETE",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ path })
        });
        this.dispatchEvent(new CustomEvent("sw-library", { bubbles: true, composed: true, detail: { action: "delete", data: await response.json(), path }}));
    }

    render(library) {
        const nav = this.shadowRoot.querySelector('nav');
        nav.replaceChildren();
    
        this.#categories.forEach(category => {
            const h3 = document.createElement('h3');
            h3.textContent = category;
            const menu = document.createElement('menu');
            nav.append(h3, menu);
    
            library[category].sort(this.#orderByName).forEach(media => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                const button = document.createElement('button');
                span.append(" ", media.name);
                span.onclick = () => this.dispatchEvent(new CustomEvent("sw-library", { bubbles: true, composed: true, detail: { action: "selection", selection: media }}));
                button.append("Delete");
                button.onclick = () => this.#remove(media.path);
                menu.append(li);
                li.append(span, button);
            });
        });
    }

    #orderByName(a, b) {
        const titleA = a.name.toUpperCase();
        const titleB = b.name.toUpperCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      }
}

customElements.define("sw-library", SwLibrary);