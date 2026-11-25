const STORAGE_KEY = "arizona-watch-prices";
const priceForm = document.querySelector("#price-form");
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

try {
  render(loadEntries());
} catch {
  message.textContent = "Could not load saved sightings. Your browser storage may be unavailable.";
}

priceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";

  const date = dateInput.value;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    message.textContent = "Choose a valid date for your sighting.";
    return;
  }

  try {
    const entries = loadEntries();
    entries.push({ id: crypto.randomUUID(), price: FIXED_PRICE, date });
    saveEntries(entries);
    priceForm.reset();
    dateInput.value = localToday();
    render(entries);
  } catch {
    message.textContent = "Could not save this sighting. Please check your browser storage and try again.";
  }
});
