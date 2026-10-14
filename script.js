const logos = [
  "Cisco-logo.png",
  "html.png",
  "linux.png",
  "photoshop.webp",
  "python.webp",
  "step.png",
];

const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const statusEl = document.getElementById("status");
const overlay = document.getElementById("overlay");
const finalMovesEl = document.getElementById("final-moves");

let first = null;   // açılmış birinci kart
let locked = true;  // baxış mərhələsi bitənə qədər kliklər işləmir
let moves = 0;
let found = 0;

// Hər logonu iki dəfə götürüb qarışdırırıq, sonra lövhəyə yığırıq.
for (const logo of [...logos, ...logos].sort(() => Math.random() - 0.5)) {
  const card = document.createElement("div");
  card.className = "card flipped";
  card.dataset.logo = logo;
  card.innerHTML = `
    <div class="card-inner">
      <span class="card-back">?</span>
      <span class="card-front"><img src="images/${logo}" alt=""></span>
    </div>`;
  card.onclick = () => flipCard(card);
  board.append(card);
}

function countdown(seconds) {
  if (seconds === 0) {
    statusEl.textContent = "Cütləri tap!";
    for (const card of board.children) {
      card.classList.remove("flipped");
    }
    locked = false;
    return;
  }

  statusEl.innerHTML = `Kartları yadda saxla: <b>${seconds}s</b>`;
  setTimeout(() => countdown(seconds - 1), 1000);
}

function flipCard(card) {
  if (locked || card.classList.contains("flipped")) return;

  card.classList.add("flipped");

  if (!first) {
    first = card;
    return;
  }

  moves++;
  movesEl.textContent = moves;

  if (first.dataset.logo === card.dataset.logo) {
    first.classList.add("matched");
    card.classList.add("matched");
    first = null;
    found++;

    if (found === logos.length) {
      statusEl.textContent = "";
      finalMovesEl.textContent = moves;
      overlay.hidden = false;
    }
  } else {
    locked = true;
    setTimeout(() => {
      first.classList.remove("flipped");
      card.classList.remove("flipped");
      first = null;
      locked = false;
    }, 800);
  }
}

// Səhifəni yeniləmək bütün vəziyyəti (dəyişənlər, taymerlər, kartlar) sıfırlayır.
document.getElementById("restart").onclick = () => location.reload();
document.getElementById("play-again").onclick = () => location.reload();

countdown(5);
