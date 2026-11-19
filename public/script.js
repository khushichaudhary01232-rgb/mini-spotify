const API = "";   // same domain on Vercel
const audio = document.getElementById("audio");
const list = document.getElementById("songList");
let songs = [], current = -1, view = "all";

// Liked songs are saved in the browser (serverless functions can't keep memory)
let liked = JSON.parse(localStorage.getItem("liked") || "[]");

async function load() {
  const q = encodeURIComponent(document.getElementById("search").value);
  songs = await (await fetch(`${API}/api/songs?q=${q}`)).json();
  render();
}

function toggleLike(id) {
  liked = liked.includes(id) ? liked.filter(x => x !== id) : [...liked, id];
  localStorage.setItem("liked", JSON.stringify(liked));
  render();
}

function render() {
  const shown = view === "liked" ? songs.filter(s => liked.includes(s.id)) : songs;
  document.getElementById("heading").textContent = view === "liked" ? "Liked Songs" : "All Songs";
  list.innerHTML = "";
  shown.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${s.cover}" /><span class="heart">${liked.includes(s.id) ? "❤️" : "🤍"}</span>
      <p>${s.title}</p><small>${s.artist}</small>`;
    card.onclick = () => playSong(songs.indexOf(s));
    card.querySelector(".heart").onclick = e => { e.stopPropagation(); toggleLike(s.id); };
    list.appendChild(card);
  });
}

function playSong(i) {
  if (i < 0 || i >= songs.length) return;
  current = i;
  const s = songs[i];
  audio.src = s.file;
  audio.play();
  pTitle.textContent = s.title;
  pArtist.textContent = s.artist;
  pCover.src = s.cover;
  play.textContent = "⏸";
}

play.onclick = () => {
  if (current === -1) return playSong(0);
  audio.paused ? (audio.play(), play.textContent = "⏸") : (audio.pause(), play.textContent = "▶");
};
next.onclick = () => playSong((current + 1) % songs.length);
prev.onclick = () => playSong((current - 1 + songs.length) % songs.length);
audio.onended = () => next.onclick();
audio.ontimeupdate = () => seek.value = (audio.currentTime / audio.duration) * 100 || 0;
seek.oninput = () => audio.currentTime = (seek.value / 100) * audio.duration;
volume.oninput = () => audio.volume = volume.value;
search.oninput = load;
homeBtn.onclick = () => { view = "all"; homeBtn.classList.add("active"); likedBtn.classList.remove("active"); render(); };
likedBtn.onclick = () => { view = "liked"; likedBtn.classList.add("active"); homeBtn.classList.remove("active"); render(); };

load();
