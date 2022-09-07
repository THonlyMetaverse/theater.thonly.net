function getPath(path) {
    return path.replace(/[-\s\|\&\(\)]/g, '\\$&');
}

function getCommand(path) {
    console.log(`ffmpeg -i ${path} -c:v libx264 -pix_fmt yuv420p -movflags faststart ${path}.mp4`);
}

function getCommand2(left, right) {
    console.log(`ffmpeg -i ${left} -i ${right} -c:v libx264 -pix_fmt yuv420p -movflags faststart ${path}.mp4`);
}

function getCommand3() {
    // first cd into the folder
    console.log('for i in *.avi; do ffmpeg -i "$i" -c:v libx264 -pix_fmt yuv420p -movflags faststart "${i%.*}.mp4"; done');
}

getCommand(getPath("/Users/heartbank/Desktop/HeartBank®/THonly™/thonly.net/theater.thonly.net/movies/Gladiator/film.mkv"))
//getCommand2(getPath("/Users/heartbank/Desktop/HeartBank®/THonly™/thonly.net/theater.thonly.net/movies/Anime/Laputa/film1.mkv", "/Users/heartbank/Desktop/HeartBank®/THonly™/thonly.net/theater.thonly.net/movies/Anime/Laputa/film2.mkv"))

// ffmpeg -y -i ${path} -c:v libx264 -b:v 5000k -minrate 1000k -maxrate 8000k -pass 1 -c:a aac -f mp4 /dev/null && ffmpeg -i ${path} -c:v libx264 -b:v 5000k -minrate 1000k -maxrate 8000k -pass 2 -c:a aac -movflags faststart ${path}.mp4
// ffmpeg -i ${path} -vcodec h264 -pix_fmt yuv420p ${path}.mp4
// ffmpeg -i ${path} -vcodec libx264 -pix_fmt yuv420p -profile:v baseline -level 3 ${path}.mp4
// ffmpeg -i ${path} -c:v copy -c:a copy ${path}.mp4
// ffmpeg -y -i ${path} -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -c:a libvo_aacenc -b:a 128k ${path}.mp4