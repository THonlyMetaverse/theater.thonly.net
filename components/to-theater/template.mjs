const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/to-theater/shadow.css">
    <video controls preload autopictureinpicture>
        <track label="English" kind="subtitles" srclang="en" default>
    </video>
    <aside>
        <button onclick="this.getRootNode().host.dispatch('previous', event)">Previous</button>
        <button onclick="this.getRootNode().host.dispatch('next', event)">Next</button>
    </aside>
`;

export default template;