const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/to-theater/shadow.css">
    <video controls preload autopictureinpicture src="movies/Condor Heroes/Legend of the Condor Heroes/[Jiang Hu] Legend of the Condor Heroes '08 Episode 01v2.mp4"></video>
    <aside>
        <button onclick="this.getRootNode().host.previousEpisode()">Previous</button>
        <button onclick="this.getRootNode().host.nextEpisode()">Next</button>
    </aside>
`;

export default template;