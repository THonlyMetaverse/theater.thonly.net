import fs from 'fs';

//TODO: later save metada into video file?
export async function getLibrary(media) { // movies or shows
    const collections = {};
    const library = fs.opendirSync('library/' + media);
    let folders = true;
    while (folders) { 
        const categoryOrShowFolder = library.readSync();
        if (categoryOrShowFolder) {
            if (categoryOrShowFolder.isDirectory()) {
                collections[categoryOrShowFolder.name] = [];
                const movieOrSeasonFolders = fs.opendirSync(`library/${media}/${categoryOrShowFolder.name}`);
                let subfolders = true;
                while (subfolders) {
                    const movieOrShowFolder = movieOrSeasonFolders.readSync();
                    if (movieOrShowFolder) {
                        if (movieOrShowFolder.isDirectory()) {
                            const title = movieOrShowFolder.name;
                            const path = movieOrSeasonFolders.path + "/" + movieOrShowFolder.name;
                            const movieOrShow = media === "movies" ? await getMovie(title, path) : await getShow(title, path);
                            collections[categoryOrShowFolder.name].push(movieOrShow);
                        }
                    } else subfolders = false;
                }
                movieOrSeasonFolders.close();
            }
        } else folders = false;
    } 
    library.close();
    return collections;
}

async function getMovie(title, path) {
    const { default: meta } = await import("../" + path + "/meta.mjs");
    const movie = { ...meta };
    movie.id = path;
    movie.title = title;
    movie.film = path + "/film.mp4";
    movie.poster = path + "/poster.jpg";
    movie.english = fs.existsSync(path + "/english.srt") ? path + "/english.srt" : null;
    //({ default: movie.meta } = await import("../" + path + "/meta.mjs"));
    return movie;
}

async function getShow(title, path) {
    const { default: meta } = await import("../" + path + "/meta.mjs");
    const show = { ...meta };
    show.id = path;
    show.title = title;
    show.path = path;
    show.poster = path + "/poster.jpg";
    //({ default: show.meta } = await import("../" + path + "/meta.mjs"));
    return show;
}

//getLibrary("movies").then(collections => console.log(collections));
