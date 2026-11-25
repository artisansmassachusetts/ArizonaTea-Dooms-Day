const priceEl = document.getElementById("chaos-price");
const warningEl = document.getElementById("warning");
const storyEl = document.getElementById("story");
const achievementsEl = document.getElementById("achievements");
const newsEl = document.getElementById("news-ticker");
const logEl = document.getElementById("log-console");

const STORAGE_KEY = "arizona-doomsday-ending";

let cents = 99n;
let halted = false;
let timelineAge = 0;
let anomalyCount = 0;
let goldenCanFound = false;

const savedEnding = localStorage.getItem(STORAGE_KEY);

const unlocked = new Set();

const achievements = [
  [1n, "First Dollar"],
  [10n, "Double Digits"],
  [100n, "Three Figures"],
  [1000n, "Economic Menace"],
  [10000n, "National Emergency"],
  [1000000n, "Asset Class"],
  [1000000000n, "Living Myth"],
  [1000000000000n, "Reality Breach"],
  [1000000000000000n, "Galactic Commodity"],
  [1000000000000000000n, "Universal Currency"],
  [1000000000000000000000n, "Tea Singularity"],
  [1000000000000000000000000n, "Beyond Economics"]
];

const newsItems = [
  "BREAKING: Arizona surpasses gold.",
  "BREAKING: Tea futures reach record highs.",
  "BREAKING: Congress schedules emergency hydration hearing.",
  "BREAKING: Federal Tea Reserve convenes.",
  "BREAKING: Beverage economists concerned.",
  "BREAKING: Arizona adopted by Moon colony.",
  "BREAKING: Martian banks suspend trading.",
  "BREAKING: Tea-backed securities dominate markets.",
  "BREAKING: Price charts now vertical."
];

const emergencyAlerts = [
  "FEMA ALERT: DO NOT PANIC BUY BEVERAGES.",
  "FEDERAL TEA RESERVE ALERT: VOLATILITY EXCEEDS MODELS.",
  "COMMERCE ALERT: ARIZONA ACCEPTED ON ALL MAJOR WORLDS.",
  "TIMELINE AUTHORITY ADVISORY: REALITY STABILITY DECLINING.",
  "PUBLIC NOTICE: PLEASE REMAIN HYDRATED."
];

const logs = [
  "LOG-084: Public concern remains manageable.",
  "LOG-132: Price exceeds luxury vehicle values.",
  "LOG-201: Beverage economists deployed.",
  "LOG-311: Federal Tea Reserve activated.",
  "LOG-502: Multiple markets halted.",
  "LOG-681: Moon colony requests assistance.",
  "LOG-902: Timeline integrity unstable.",
  "LOG-999: Reality classified as compromised."
];

const clockStates = [
  "11:58",
  "11:59",
  "12:00",
  "12:01",
  "--:--",
  "??:??",
  "∞:∞"
];

let codeBuffer = "";

function unlock(name) {

  if (unlocked.has(name)) {
    return;
  }

  unlocked.add(name);

  const badge = document.createElement("span");

  badge.className = "badge";
  badge.textContent = "✅ " + name;

  achievementsEl.appendChild(badge);

  addLog("ACHIEVEMENT UNLOCKED: " + name);
}

function addLog(text) {

  const row = document.createElement("div");

  row.textContent =
    "[" +
    new Date().toLocaleTimeString() +
    "] " +
    text;

  logEl.prepend(row);

  while (logEl.children.length > 20) {
    logEl.removeChild(logEl.lastChild);
  }
}

function formatPrice() {

  const dollars = cents / 100n;

  const remainder =
    (cents % 100n)
      .toString()
      .padStart(2, "0");

  return (
    "$" +
    dollars.toLocaleString() +
    "." +
    remainder
  );
}

function updateLore(dollars) {

  if (dollars < 10n) {

    warningEl.textContent =
      "Analysts are monitoring the situation.";

    storyEl.textContent =
      "Customers report mild confusion at checkout.";
  }

  else if (dollars < 100n) {

    warningEl.textContent =
      "The Arizona Council has convened.";

    storyEl.textContent =
      "The 99¢ era is increasingly difficult to verify.";
  }

  else if (dollars < 1000n) {

    warningEl.textContent =
      "National concern is rising.";

    storyEl.textContent =
      "People whisper about affordable beverages.";
  }

  else if (dollars < 10000n) {

    warningEl.textContent =
      "Economic stability is deteriorating.";

    storyEl.textContent =
      "Luxury cars now cost less than Arizona Tea.";
  }

  else if (dollars < 1000000n) {

    warningEl.textContent =
      "THIS IS NOT A DRILL.";

    storyEl.textContent =
      "Investment portfolios are becoming beverage-heavy.";
  }

  else if (dollars < 1000000000n) {

    warningEl.textContent =
      "The tea has become an asset class.";

    storyEl.textContent =
      "Universities now offer Arizona valuation degrees.";
  }

  else if (dollars < 1000000000000n) {

    warningEl.textContent =
      "Reality is destabilizing.";

    storyEl.textContent =
      "Humanity remembers 99¢ only through legends.";
  }

  else if (dollars < 1000000000000000n) {

    warningEl.textContent =
      "CONTAINMENT TEAMS DISPATCHED";

    storyEl.textContent =
      "Ancient records mention a forgotten shutdown code.";
  }

  else if (dollars < 1000000000000000000n) {

    warningEl.textContent =
      "EMERGENCY SHUTDOWN CODE REQUIRED";

    storyEl.textContent =
      "Recovered documents repeatedly reference '99CENTS'.";
  }

  else {

    warningEl.textContent =
      "PRICE CONTAINMENT FAILURE";

    storyEl.textContent =
      "The tea has become a fundamental force of nature.";
  }

  if (dollars > 1000000000000n) {

    document.title =
      "Arizona Watch — " +
      clockStates[
        Math.floor(
          Math.random() *
          clockStates.length
        )
      ];
  }
}

function triggerGoldenCan() {

  if (goldenCanFound) {
    return;
  }

  goldenCanFound = true;

  const badge =
    document.createElement("span");

  badge.className = "badge";
  badge.textContent =
    "🏆 Golden Can";

  achievementsEl.appendChild(badge);

  addLog(
    "GOLDEN CAN EVENT DETECTED"
  );
}

function updatePrice() {

  if (halted) {
    return;
  }

  const dollars = cents / 100n;

  priceEl.textContent =
    formatPrice();

  updateLore(dollars);

  achievements.forEach(
    ([amount, name]) => {

      if (dollars >= amount) {
        unlock(name);
      }
    }
  );

  if (Math.random() < 0.0008) {

    const jump =
      BigInt(
        Math.floor(
          Math.random() *
          10000000
        ) + 500000
      );

    anomalyCount++;

    cents += jump * 100n;

    addLog(
      "TIME ANOMALY DETECTED +" +
      jump.toLocaleString()
    );
  }

  if (
    !goldenCanFound &&
    Math.random() < 0.0001
  ) {
    triggerGoldenCan();
  }

  cents += 1n;
}

function shutdownEnding() {

  halted = true;

  document.body.classList.add(
    "shutdown"
  );

  localStorage.setItem(
    STORAGE_KEY,
    "shutdown"
  );

  warningEl.textContent =
    "EMERGENCY CONTAINMENT SUCCESSFUL";

  storyEl.textContent =
    "The sacred 99¢ timeline has been restored.";

  priceEl.textContent =
    "$0.99";

  addLog(
    "CONTAINMENT ACHIEVED"
  );
}

function palmerEnding() {

  halted = true;

  document.body.classList.add(
    "palmer-ending"
  );

  localStorage.setItem(
    STORAGE_KEY,
    "palmer"
  );

  warningEl.textContent =
    "ALTERNATE TIMELINE RESTORED";

  storyEl.textContent =
    "Half tea. Half lemonade. Full peace.";

  priceEl.textContent =
    "$0.99";

  addLog(
    "ARNOLD PALMER PROTOCOL ACTIVATED"
  );
}

function bigCanEnding() {

  halted = true;

  document.body.classList.add(
    "big-can-ending"
  );

  localStorage.setItem(
    STORAGE_KEY,
    "bigazcan"
  );

  warningEl.textContent =
    "THE PROPHECY IS FULFILLED";

  storyEl.textContent =
    "99¢ FOREVER.";

  priceEl.textContent =
    "99¢ FOREVER";

  addLog(
    "BIG AZ CAN ENDING TRIGGERED"
  );
}

document.addEventListener(
  "keydown",
  (event) => {

    codeBuffer +=
      event.key.toUpperCase();

    codeBuffer =
      codeBuffer.slice(-30);

    if (
      codeBuffer.includes(
        "99CENTS"
      )
    ) {
      shutdownEnding();
    }

    if (
      codeBuffer.includes(
        "ARNOLDPALMER"
      )
    ) {
      palmerEnding();
    }

    if (
      codeBuffer.includes(
        "BIGAZCAN"
      )
    ) {
      bigCanEnding();
    }

    if (
      codeBuffer.includes(
        "RESETTIMELINE"
      )
    ) {

      localStorage.removeItem(
        STORAGE_KEY
      );

      location.reload();
    }
  }
);

if (savedEnding === "shutdown") {
  shutdownEnding();
}

if (savedEnding === "palmer") {
  palmerEnding();
}

if (savedEnding === "bigazcan") {
  bigCanEnding();
}

setInterval(() => {

  if (Math.random() < 0.25) {

    newsEl.textContent =
      emergencyAlerts[
        Math.floor(
          Math.random() *
          emergencyAlerts.length
        )
      ];
  }

  else {

    newsEl.textContent =
      newsItems[
        Math.floor(
          Math.random() *
          newsItems.length
        )
      ];
  }

}, 4000);

setInterval(() => {

  addLog(
    logs[
      Math.floor(
        Math.random() *
        logs.length
      )
    ]
  );

}, 7000);

setInterval(() => {

  timelineAge++;

}, 1000);

setInterval(
  updatePrice,
  100
);

addLog(
  "TIMELINE DIVERGENCE DETECTED"
);

addLog(
  "ARIZONA PRICE EVENT ACTIVE"
);

console.log(
  "%cARIZONA WATCH",
  "color:#ffd166;font-size:18px;font-weight:bold"
);

console.log(
  "Timeline divergence detected."
);

console.log(
  "Clock status: 11:58 PM"
);

console.log(
  "There is absolutely nothing unusual about the clock."
);
