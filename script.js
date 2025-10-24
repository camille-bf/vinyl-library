const audio = document.getElementById("audioPlayer");
const progressBar = document.querySelector("#progress-bar-fill");
const vinyls = document.querySelectorAll(".vinyl");
const playcd = document.getElementById("playcd");
const dropText = document.getElementById("drop-text");
const vinylText = document.querySelector(".vinyl-text");
let draggedVinyl = null;
const shelf = document.querySelector(".shelf");
const rows = Array.from(shelf.querySelectorAll(".vinyl-row"));
let allVinyls = Array.from(shelf.querySelectorAll(".vinyl"));

//---------------------------------------------------------------------------
// 13. intro dialog

let introModal = document.querySelector(".introDialog");
document.querySelector(".introDialog").showModal();
document.getElementById("dialogCloseButton").addEventListener("click", () => {
  introModal.close();
});

//---------------------------------------------------------------------------
// 1. randomly rotate vinyls to give a casual look
vinyls.forEach((vinyl) => {
  const img = vinyl.querySelector("img");
  const randomAngle = Math.floor(Math.random() * 21) - 10; // -12° to 12°
  img.style.transform = `rotate(${randomAngle}deg)`;
});

//---------------------------------------------------------------------------
// 2. reset drop text when audio ends
function resetDropText() {
  dropText.classList.remove("playing");
  dropText.textContent = "Drag a vinyl here to play a sample!";
}

//---------------------------------------------------------------------------
// 3. update drop text when a vinyl is dropped
function updateDropText() {
  const infoP = draggedVinyl.querySelector(".info p");
  if (infoP) {
    dropText.classList.add("playing");
    dropText.textContent = `Now playing: ${infoP.previousElementSibling.textContent} by ${infoP.textContent}`;
  } else {
    dropText.textContent = "Now playing";
  }
}

//---------------------------------------------------------------------------
// 4. vinyl notes where i explain why i chose each song and what it means to me
const vinylNotes = {
  "assets/sample1.mp3":
    "This was the first K-pop group I really fell in love with, and it all started with this song. I remember when it came out, I immediately loved it and ended up diving into TXT’s entire discography. Their music videos and choreography hooked me even more.",
  "assets/sample2.mp3":
    "Miracle is one of my favorite TXT songs. Seeing it live in concert gave me such a nostalgic feeling, even though it’s a relatively recent release. Four of the members contributed to writing the lyrics, which makes the song feel really authentic.",
  "assets/sample3.mp3":
    "Taylor Swift has been my favorite artist growing up, she’s basically my entire childhood soundtrack. Wildest Dreams is my favorite song from her 1989 album; it has such a dreamy vibe that I adore.",
  "assets/sample4.mp3":
    "This was the first (and only) girl K-pop group I saw live. This song became my most-played track for at least three months straight when it first came out, its charm hit me immediately, right from the first listen.",
  "assets/sample5.mp3":
    "Social Path explores chasing your dreams despite loneliness and isolation. I knew instantly that it would be my favorite song by Stray Kids as soon as it dropped.",
  "assets/sample6.mp3":
    "Heavenly by CAS is my favorite from this band. I listened to them a lot in 2022, so this song really marks that year for me, it brings back so many memories.",
  "assets/sample7.mp3":
    "Sweater Weather is one of those songs I love listening to in the fall. It perfectly matches the cozy, slightly melancholic vibe of the season.",
  "assets/sample8.mp3":
    "Creep by Radiohead is hauntingly beautiful. The raw emotion in the vocals and the slow, moody instrumentation just hits differently every time I listen.",
  "assets/sample9.mp3":
    "I absolutely love ENHYPEN. When I first listened to No Doubt, it instantly clicked, the music video, the vocals, the visuals, everything is flawless.",
  "assets/sample10.mp3":
    "At first, this wasn’t my favorite from ATEEZ, but when I heard Silver Light live in concert, it completely hit differently. It immediately became one of my top tracks.",
  "assets/sample11.mp3":
    "Stray Kids really blew up with S-Class. They’ve won multiple awards because of this song, and it’s easy to see why, their dance synchronization and rapping skills are unmatched.",
  "assets/sample12.mp3":
    "I hadn’t heard of this artist before, but a stranger online recommended this song to me. I instantly liked it and ended up loving the genre too",
};

//---------------------------------------------------------------------------
// 5. show floating text when vinyl is dropped
function showFloatingText() {
  const audioSrc = draggedVinyl.dataset.audio;
  const text = vinylNotes[audioSrc] || "";
  vinylText.textContent = text;

  vinylText.classList.remove("float");
  void vinylText.offsetWidth;
  vinylText.classList.add("float");
}

//---------------------------------------------------------------------------
// 6. make vinyls draggable from the shelf
vinyls.forEach((vinyl) => {
  vinyl.draggable = true;
  vinyl.addEventListener("dragstart", startDragging);
  vinyl.addEventListener("dragend", stopDragging);
});

//---------------------------------------------------------------------------
// 7. set up playcd as a drop zone for vinyls so users can drag and drop vinyls there
playcd.addEventListener("dragover", allowDrop);
playcd.addEventListener("drop", dropVinyl);

//---------------------------------------------------------------------------
// 8. drag and drop functions

function startDragging(event) {
  draggedVinyl = event.currentTarget;
}

function stopDragging() {
  draggedVinyl = null;
}

function allowDrop(event) {
  event.preventDefault();
}

function dropVinyl(event) {
  event.preventDefault();
  if (!draggedVinyl) return;

  showVinylPreview();
  playVinylAudio();
  updateDropText();
  showFloatingText();
}

//---------------------------------------------------------------------------
// 9. show vinyl preview on playcd
function showVinylPreview() {
  const oldVinyl = playcd.querySelector(".vinyl-preview");
  if (oldVinyl) oldVinyl.remove();

  const img = document.createElement("img");
  img.src = draggedVinyl.querySelector("img").src;
  img.className = "vinyl-preview";
  playcd.appendChild(img);
}

//---------------------------------------------------------------------------
// 10. play vinyl audio
function playVinylAudio() {
  const audioSrc = draggedVinyl.dataset.audio;
  if (!audioSrc) return;
  audio.src = audioSrc;
  audio.play();
}

//---------------------------------------------------------------------------
// 11. audio event listeners
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", resetDropText);

//---------------------------------------------------------------------------
// 12. update progress bar
function updateProgress() {
  if (!audio.duration) return;
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = progress + "%";
}

//---------------------------------------------------------------------------
// 13. shuffle vinyls on shelf
allVinyls.sort(() => Math.random() - 0.5);

rows.forEach((row) => (row.innerHTML = ""));
allVinyls.forEach((v, i) => rows[i % rows.length].appendChild(v));
