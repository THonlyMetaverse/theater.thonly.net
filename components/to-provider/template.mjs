const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/to-provider/shadow.css">
    <slot></slot>
    <br>
    <button onclick="this.getRootNode().host.refreshLibrary()">Refresh Library</button>
    <!--<button onclick="this.getRootNode().host.test()">Run Test</button>-->
`;

export default template;