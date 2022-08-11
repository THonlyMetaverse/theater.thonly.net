import fs from 'fs';
import { exec } from "child_process";

// ffmpeg -i ${path} -c:v libx264 -pix_fmt yuv420p -movflags faststart ${path}.mp4
// ffmpeg -y -i ${path} -c:v libx264 -b:v 5000k -minrate 1000k -maxrate 8000k -pass 1 -c:a aac -f mp4 /dev/null && ffmpeg -i ${path} -c:v libx264 -b:v 5000k -minrate 1000k -maxrate 8000k -pass 2 -c:a aac -movflags faststart ${path}.mp4
// ffmpeg -i ${path} -vcodec h264 -pix_fmt yuv420p ${path}.mp4
// ffmpeg -i ${path} -vcodec libx264 -pix_fmt yuv420p -profile:v baseline -level 3 ${path}.mp4
// ffmpeg -i ${path} -c:v copy -c:a copy ${path}.mp4
// ffmpeg -y -i ${path} -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -c:a libvo_aacenc -b:a 128k ${path}.mp4
function getCommand(path) {
    path = path.replace(/[-\s\|\&\(\)]/g, '\\$&');
    console.log(`ffmpeg -i ${path} -c:v libx264 -pix_fmt yuv420p -movflags faststart ${path}.mp4`);
}

function convert(path) {
    path = path.replace(/[-\s\|\&\(\)]/g, '\\$&');
    exec(`sudo ffmpeg -i ${path} -c:v libx264 -pix_fmt yuv420p -movflags faststart ${path}.mp4`, (error, stdout, stderr) => {
        if (error) console.log("Error:", error.message);
        if (stderr) console.log("StdErr:", stderr);
        if (stdout) console.log("StdOut:", stdout);
    });
}

getCommand("/Users/heartbank/Desktop/HeartBank®/THonly™/thonly.net/theater.thonly.net/movies/Man of Steel/film.avi");

