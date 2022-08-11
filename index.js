import './timer.mjs';
import renderPlayer, { setFavorite } from './player.mjs';

window.onload = () => {
    renderPlayer();
}

window.getMusicLibrary = async () => {
    const response = await fetch('https://dns.thonly.net:432/');
    const data = await response.json();
    localStorage.setItem('library', JSON.stringify(data.library));
    document.location.reload();
}

window.addMusic = async event => {
    event.preventDefault();
    const response = await fetch('https://dns.thonly.net:432/', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.target)))
    });
    const data = await response.json();
    localStorage.setItem('library', JSON.stringify(data.library));
    setFavorite(data.favorite);
    document.location.reload();
}

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-LF68BM80LP');