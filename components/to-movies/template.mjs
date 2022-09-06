const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/sw-library/shadow.css">
    <fieldset>
        <legend><h2>Media Library</h2></legend>
        <button onclick="this.getRootNode().host.emitRefresh()">Refresh</button>
        <nav></nav>
    </fieldset>   
`;

export default template;