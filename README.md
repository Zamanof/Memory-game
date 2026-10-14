# Memory Card Matching Game — `script.js` izahı

Bu sənəd `script.js` faylını bölmə-bölmə izah edir. Hər sətrin izahı kodun özündə şərh (`//`) kimi verilir; şərhə sığmayan məqamlar kod blokundan sonra qeyd olunur.

Layihənin faylları:

| Fayl | Rolu |
|---|---|
| `index.html` | Səhifənin skeleti: başlıq, Moves sayğacı, boş lövhə, qalib mesajı |
| `style.css` | Bütün dizayn: rənglər, grid, kartın 3D çevrilmə animasiyası |
| `script.js` | Oyunun məntiqi — bu sənədin mövzusu |
| `images/` | 6 logo şəkli + kartın ön tərəfi üçün `card-frame.jpg` |

Oyunu açmaq üçün `index.html` faylına iki dəfə klikləyin. Server lazım deyil.

---

## 1. Logo adlarının siyahısı (sətir 1–8)

```js
const logos = [        // oyunun 6 cütü üçün şəkil adları
  "Cisco-logo.png",
  "html.png",
  "linux.png",
  "photoshop.webp",
  "python.webp",
  "step.png",
];
```

Siyahıda 6 ad var, çünki oyun 6 cütdən ibarətdir. Şəkilləri dəyişmək istəsəniz, yalnız bu siyahını redaktə edin — qalan kod neçə logo olduğunu `logos.length` ilə özü hesablayır.

---

## 2. HTML elementlərinə bağlanma (sətir 10–14)

```js
const board = document.getElementById("board");               // kartların yığılacağı boş div
const movesEl = document.getElementById("moves");             // Moves sayğacının rəqəmi
const statusEl = document.getElementById("status");           // lövhənin üstündəki mətn sahəsi
const overlay = document.getElementById("overlay");           // "You Win!" qatı, başlanğıcda gizli
const finalMovesEl = document.getElementById("final-moves");  // qalib mesajındaki yekun rəqəm
```

Elementləri bir dəfə tapıb dəyişəndə saxlamaq, hər dəfə yenidən axtarmaqdan səmərəlidir. Ad sonundaki `El` "element" sözünün qısaltmasıdır.

---

## 3. Oyunun vəziyyəti (sətir 16–19)

```js
let first = null;    // cütün birinci açılmış kartı; null = hələ heç nə açılmayıb
let locked = true;   // true olduqda kliklər işləmir; başlanğıcda true, çünki baxış mərhələsidir
let moves = 0;       // gediş sayı (bir gediş = iki kartın açılması)
let found = 0;       // tapılmış cütlərin sayı
```

Bunlar oyunun yaddaşıdır. `const` yerinə `let` işlənir, çünki bu dəyərlər oyun boyunca dəyişir. `first` dəyişəni ən vacibidir: məhz onun sayəsində kod birinci və ikinci klikləri bir-birindən ayırır.

---

## 4. Kartların yaradılması (sətir 21–33)

```js
// Hər logonu iki dəfə götürüb qarışdırırıq, sonra lövhəyə yığırıq.
for (const logo of [...logos, ...logos].sort(() => Math.random() - 0.5)) {
  const card = document.createElement("div");  // yaddaşda yeni element, hələ ekranda yox
  card.className = "card flipped";             // "flipped" = kart açıq; baxış mərhələsi üçün
  card.dataset.logo = logo;                    // HTML-də data-logo="html.png" kimi saxlanır
  card.innerHTML = `
    <div class="card-inner">
      <span class="card-back">?</span>
      <span class="card-front"><img src="images/${logo}" alt=""></span>
    </div>`;
  card.onclick = () => flipCard(card);         // klik olanda bu kartla flipCard çağırılacaq
  board.append(card);                          // bu andan kart ekranda görünür
}
```

Dövrənin başlığında üç şey eyni anda baş verir:

- `[...logos, ...logos]` — `...` (spread) operatoru siyahının elementlərini açır, nəticədə 6 + 6 = 12 elementli yeni massiv alınır.
- `.sort(() => Math.random() - 0.5)` — massivi qarışdırır. `Math.random()` 0 ilə 1 arasında rəqəm verir; ondan 0.5 çıxanda nəticə gah mənfi, gah müsbət olur və `sort` elementləri təsadüfi yerləşdirir.
- `for (const logo of ...)` — 12 elementin üzərindən keçir, hər dövrədə `logo` cari şəkil adını saxlayır.

Kartın daxili HTML-i üç hissədən ibarətdir: `card-inner` çevrilən hissədir (CSS-də `rotateY(180deg)` məhz buna tətbiq olunur), `card-back` bağlı tərəfdir (`?` işarəsi), `card-front` isə açıq tərəfdir (logo şəkli). Backtick (`` ` ``) çox sətirli mətn yazmağa icazə verir, `${logo}` isə mətnin içinə dəyişənin dəyərini yerləşdirir.

`card.onclick` sətrində `flipCard` **çağırılmır** — yalnız "klik olanda bunu çağır" göstərişi verilir.

---

## 5. 5 saniyəlik geriyə sayma (sətir 35–47)

```js
function countdown(seconds) {
  if (seconds === 0) {                   // sayma bitdi
    statusEl.textContent = "Cütləri tap!";
    for (const card of board.children) {
      card.classList.remove("flipped");  // bütün kartlar bağlanır
    }
    locked = false;                      // kilid açılır, oyunçu artıq klikləyə bilər
    return;
  }

  statusEl.innerHTML = `Kartları yadda saxla: <b>${seconds}s</b>`;
  setTimeout(() => countdown(seconds - 1), 1000);  // 1 saniyə sonra özünü çağırır
}
```

Funksiya özünü çağırır (rekursiya) və beləcə 5 → 4 → 3 → 2 → 1 → 0 zənciri yaranır, cəmi 5 saniyə keçir.

Status sahəsinə `textContent` yerinə `innerHTML` yazılır, çünki mətnin içində `<b>` teqi var — CSS-dəki `.status b` qaydası rəqəmi narıncı rəngə boyayır.

---

## 6. Oyunun əsas məntiqi (sətir 49–82)

```js
function flipCard(card) {
  if (locked || card.classList.contains("flipped")) return;  // yanlış klikləri rədd edir

  card.classList.add("flipped");                 // kart çevrilib açılır

  if (!first) {                                  // bu, cütün birinci kartıdır
    first = card;                                // yadda saxla və dayan
    return;
  }

  moves++;                                       // gediş yalnız ikinci klikdə sayılır
  movesEl.textContent = moves;

  if (first.dataset.logo === card.dataset.logo) {  // cüt uyğun gəldi
    first.classList.add("matched");                // yaşıl halqa verir
    card.classList.add("matched");
    first = null;                                  // növbəti cüt üçün yaddaş təmizlənir
    found++;

    if (found === logos.length) {                  // 6 cütün hamısı tapıldı
      statusEl.textContent = "";
      finalMovesEl.textContent = moves;
      overlay.hidden = false;                      // "You Win!" göstərilir
    }
  } else {                                         // cüt uyğun gəlmədi
    locked = true;                                 // gözləmə vaxtında kliklər bloklanır
    setTimeout(() => {
      first.classList.remove("flipped");           // 800ms sonra ikisi də bağlanır
      card.classList.remove("flipped");
      first = null;
      locked = false;
    }, 800);
  }
}
```

Funksiyanın birinci sətri — mühafizə şərti — oyunun üç klassik səhvini birdən həll edir: eyni karta iki dəfə klikləmək, tapılmış kartı yenidən seçmək və kartlar bağlanana qədər üçüncü karta basmaq. `locked` kilidi ya baxış mərhələsində, ya da uyğun gəlməyən cütün 800 millisaniyəlik gözləməsində `true` olur.

`moves++` sətri məhz ikinci klikdən sonra dayanır — hər klikdə deyil. Odur ki, sayğac gedişləri düzgün sayır.

Uyğun gələn kartlarda `flipped` sinfi qalır, ona görə onlar açıq qalır və mühafizə şərti onları bir daha kliklənməyə qoymur.

`found === logos.length` yazmaq `found === 6` yazmaqdan üstündür: siyahıya yeni logo əlavə etsəniz, qalib şərti özünü uyğunlaşdırır.

---

## 7. Düymələr və oyunun başlanması (sətir 84–88)

```js
// Səhifəni yeniləmək bütün vəziyyəti (dəyişənlər, taymerlər, kartlar) sıfırlayır.
document.getElementById("restart").onclick = () => location.reload();
document.getElementById("play-again").onclick = () => location.reload();

countdown(5);  // oyunu başladan sətir: 5 saniyəlik baxış mərhələsini açır
```

`location.reload()` ən sadə Restart həllidir: brauzer bütün dəyişənləri, işləyən taymerləri və kartları özü silib hər şeyi sıfırdan qurur. Əks halda hər dəyişəni ayrıca sıfırlayan 8–10 sətirlik kod yazmaq lazım gələrdi.

`countdown(5)` faylın ən sonunda dayanır, yəni kartlar artıq yaradıldıqdan sonra işləyir.

---

## 8. Oyunun gedişatı

1. Səhifə açılır, 4-cü bölmədəki dövrə 12 kartı açıq vəziyyətdə yaradır.
2. `countdown(5)` işə düşür: 5 saniyə geriyə sayma gedir, `locked` hələ `true`-dur.
3. Sayma 0-a çatır, bütün kartlar bağlanır, `locked` `false` olur.
4. Birinci klik kartı `first`-də saxlayır və dayanır.
5. İkinci klik gedişi sayır və iki kartı müqayisə edir: uyğun gəlirsə açıq qalır, gəlmirsə 800ms sonra bağlanır.
6. 6 cüt tapıldıqda "You Win!" qatı göstərilir.
7. Restart və ya Play Again səhifəni yeniləyir, hər şey yenidən başlayır.

## 9. Nəyi asanca dəyişə bilərsiniz

- **Şəkilləri** — `logos` siyahısındaki fayl adlarını dəyişin və yeni şəkilləri `images` qovluğuna atın.
- **Baxış müddətini** — faylın sonundaki `countdown(5)` rəqəmini dəyişin.
- **Kartların bağlanma sürətini** — `setTimeout`-un sonundaki `800` rəqəmini dəyişin.
- **Kartların sayını** — `logos` siyahısına logo əlavə edin. Kod cütləri və qalib şərtini özü hesablayır, yalnız `style.css`-dəki `grid-template-columns` sətrini uyğunlaşdırmaq lazım gələ bilər.
