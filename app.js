const STORAGE_KEY = "arizona-watch-prices";
const dateInput = document.querySelector("#entry-date");
const message = document.querySelector("#form-message");
const historyList = document.querySelector("#history-list");
const FIXED_PRICE = 0.99;

const localToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

function loadEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  const entries = JSON.parse(saved);
  if (
    !Array.isArray(entries) ||
    entries.some(
      (entry) =>
        typeof entry.id !== "string" ||
        typeof entry.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(entry.date),
    )
  ) {
    throw new Error("Saved sighting history is not valid.");
  }

  // Keep existing local dates, but every sighting represents the fixed 99¢ price.
  return entries.map(({ id, date }) => ({ id, date, price: FIXED_PRICE }));
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function render(entries) {
  const sortedEntries = entries
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) =>
        b.entry.date.localeCompare(a.entry.date) || b.index - a.index,
    )
    .map(({ entry }) => entry);

  dateInput.value ||= localToday();
  document.querySelector("#entry-count").textContent =
    entries.length === 1 ? "1 sighting in your log" : `${entries.length} sightings in your log`;

  // This is a fixed-price tribute tracker, so the displayed price and change never fluctuate.
  document.querySelector("#latest-price").textContent = formatPrice(FIXED_PRICE);
  document.querySelector("#latest-date").textContent = "The legendary price. Still standing.";
  document.querySelector("#lowest-price").textContent = formatPrice(FIXED_PRICE);
  document.querySelector("#lowest-date").textContent = "The floor is the floor.";
  document.querySelector("#price-change").textContent = formatPrice(0);
  document.querySelector("#change-caption").textContent = "Clock status: permanently frozen";

  if (!sortedEntries.length) {
    historyList.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">＋</span>
        <p>Your first sighting goes here.</p>
        <span>Log a date to start your 99¢ roll call.</span>
      </div>`;
    return;
  }

  historyList.replaceChildren(
    ...sortedEntries.map((entry) => {
      const row = document.createElement("div");
      row.className = "history-row";

      const icon = document.createElement("span");
      icon.className = "history-date-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "◷";

      const details = document.createElement("div");
      details.className = "history-details";

      const date = document.createElement("div");
      date.className = "history-date";
      date.textContent = formatDate(entry.date);

      const note = document.createElement("div");
      note.className = "history-note";
      note.textContent = "Arizona iced tea · legendary 99¢";

      const amount = document.createElement("span");
      amount.className = "history-amount";
      amount.textContent = formatPrice(FIXED_PRICE);

      const remove = document.createElement("button");
      remove.className = "delete-entry";
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Delete sighting from ${formatDate(entry.date)}`);
      remove.addEventListener("click", () => {
        const updated = entries.filter((item) => item.id !== entry.id);
        try {
          saveEntries(updated);
          message.textContent = "";
          render(updated);
        } catch {
          message.textContent = "Could not update saved sightings. Please try again.";
        }
      });

      details.append(date, note);
      row.append(icon, details, amount, remove);
      return row;
    }),
  );
}

dateInput.value = localToday();

const lowButton =
  document.querySelector("#timeline-low");

const normalButton =
  document.querySelector("#timeline-normal");

const highButton =
  document.querySelector("#timeline-high");

try {
  render(loadEntries());
} catch {
  message.textContent =
    "Could not load saved sightings. Your browser storage may be unavailable.";
}
  message.textContent = "Could not load saved sightings. Your browser storage may be unavailable.";
}
function saveTimelineSighting() {

  const entries =
    loadEntries();

  entries.push({

    id:
      crypto.randomUUID(),

    price:
      FIXED_PRICE,

    date:
      localToday()

  });

  saveEntries(
    entries
  );

  render(
    entries
  );

  return true;

}

normalButton?.addEventListener(
  "click",
  () => {

    try {

      if (
        saveTimelineSighting()
      ) {

        message.textContent =
          "✅ Timeline verified. Arizona Tea remains 99¢.";

      }

    } catch {

      message.textContent =
        "Could not save this sighting.";

    }

  }
);
lowButton?.addEventListener(
  "click",
  () => {

    message.textContent =
      "😇 Blessed timeline detected. Arizona Tea is 89¢ and society prospers.";

  }
);
highButton?.addEventListener(
  "click",
  () => {

    message.textContent =
      "😈 PRICE ANOMALY DETECTED";

    timelineBreach();

    if (latestDate) {

      latestDate.textContent =
        "OPENING FORBIDDEN TIMELINE";

    }

    setTimeout(
      () => {

        window.location.href =
          "midnight.html";

      },
      1800
    );

  }
);
// =====================================
// TIMELINE BREACH EVENT
// Alternate timeline leaks into page.
// =====================================

const clockTime =
  document.querySelector(".clock-time");

const latestPrice =
  document.querySelector("#latest-price");

const latestDate =
  document.querySelector("#latest-date");

const whisper =
  document.querySelector("#clock-whisper");

let audioUnlocked = false;

document.addEventListener(
  "click",
  () => {
    audioUnlocked = true;
  },
  { once: true }
);

function playTimelineBreachSound() {

  if (!audioUnlocked) {
    return;
  }

  const ctx =
    new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

  const tick =
    ctx.createOscillator();

  const tickGain =
    ctx.createGain();

  tick.type = "square";
  tick.frequency.value = 900;
  tickGain.gain.value = 0.02;

  tick.connect(tickGain);
  tickGain.connect(
    ctx.destination
  );

  tick.start();
  tick.stop(
    ctx.currentTime + 0.05
  );

  const glitch =
    ctx.createOscillator();

  const glitchGain =
    ctx.createGain();

  glitch.type = "sawtooth";

  glitch.frequency.setValueAtTime(
    400,
    ctx.currentTime + 0.08
  );

  glitch.frequency.exponentialRampToValueAtTime(
    90,
    ctx.currentTime + 0.35
  );

  glitchGain.gain.setValueAtTime(
    0.03,
    ctx.currentTime + 0.08
  );

  glitchGain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + 0.35
  );

  glitch.connect(
    glitchGain
  );

  glitchGain.connect(
    ctx.destination
  );

  glitch.start(
    ctx.currentTime + 0.08
  );

  glitch.stop(
    ctx.currentTime + 0.35
  );

}

function timelineBreach() {

  if (
    !clockTime ||
    !latestPrice ||
    !latestDate
  ) {
    return;
  }

  const originalTime =
    clockTime.textContent;

  const originalPrice =
    latestPrice.textContent;

  const originalDate =
    latestDate.textContent;

  document.body.classList.add(
    "timeline-breach"
  );

  playTimelineBreachSound();

  const whispers = [
    "click me...",
    "don't click me...",
    "one minute remains...",
    "it's almost midnight...",
    "12:01",
    "too late..."
  ];

  if (whisper) {

    whisper.textContent =
      whispers[
        Math.floor(
          Math.random() *
          whispers.length
        )
      ];

  }

  const glitchTimes = [
    "12:00",
    "12:01",
    "12:01",
    "11:60",
    "??:??",
    "∞:∞"
  ];

  clockTime.textContent =
    glitchTimes[
      Math.floor(
        Math.random() *
        glitchTimes.length
      )
    ];

  const fakePrices = [
    "$42,183.91",
    "$88,888.88",
    "$999,999.99",
    "$4,285,991.17",
    "$77,000,000.00",
    "$∞"
  ];

  latestPrice.textContent =
    fakePrices[
      Math.floor(
        Math.random() *
        fakePrices.length
      )
    ];

  const breachMessages = [
    "TIMELINE BREACH DETECTED",
    "TIK TOK TIK TOK",
    "CLICK THE CLOCK",
    "UNAUTHORIZED TIMELINE",
    "THE PRICE MOVED",
    "11:59 WATCHES YOU",
    "REALITY DESYNC DETECTED",
    "I HEARD YOUR MOM CALLING YOU"
  ];

  latestDate.textContent =
    breachMessages[
      Math.floor(
        Math.random() *
        breachMessages.length
      )
    ];

  setTimeout(() => {

    document.body.classList.remove(
      "timeline-breach"
    );

    clockTime.textContent =
      originalTime;

    latestPrice.textContent =
      originalPrice;

    latestDate.textContent =
      originalDate;

  }, 3000);

}

