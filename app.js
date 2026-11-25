const STORAGE_KEY = "arizona-watch-prices";
const priceForm = document.querySelector("#price-form");
const priceInput = document.querySelector("#price");
const dateInput = document.querySelector("#entry-date");
const message = document.querySelector("#form-message");
const historyList = document.querySelector("#history-list");

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
        typeof entry.price !== "number" ||
        !Number.isFinite(entry.price) ||
        typeof entry.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(entry.date),
    )
  ) {
    throw new Error("Saved price history is not valid.");
  }
  return entries;
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
  const chronological = entries
    .map((entry, index) => ({ entry, index }))
    .sort(
      (a, b) =>
        a.entry.date.localeCompare(b.entry.date) || a.index - b.index,
    )
    .map(({ entry }) => entry);

  dateInput.value ||= localToday();
  document.querySelector("#entry-count").textContent =
    entries.length === 1 ? "1 price in your log" : `${entries.length} prices in your log`;

  const latest = sortedEntries[0];
  const latestPrice = document.querySelector("#latest-price");
  const latestDate = document.querySelector("#latest-date");
  const lowestPrice = document.querySelector("#lowest-price");
  const lowestDate = document.querySelector("#lowest-date");
  const priceChange = document.querySelector("#price-change");
  const changeCaption = document.querySelector("#change-caption");

  if (!latest) {
    latestPrice.textContent = "—";
    latestDate.textContent = "Waiting for your first entry";
    lowestPrice.textContent = "—";
    lowestDate.textContent = "Your best find so far";
    priceChange.textContent = "—";
    changeCaption.textContent = "From your first entry";
    historyList.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon" aria-hidden="true">＋</span>
        <p>Your first price goes here.</p>
        <span>Log a bottle or can to get started.</span>
      </div>`;
    return;
  }

  const lowest = entries.reduce((minimum, entry) =>
    entry.price < minimum.price ? entry : minimum,
  );
  const first = chronological[0];
  const change = latest.price - first.price;

  latestPrice.textContent = formatPrice(latest.price);
  latestDate.textContent = `Recorded ${formatDate(latest.date)}`;
  lowestPrice.textContent = formatPrice(lowest.price);
  lowestDate.textContent = `On ${formatDate(lowest.date)}`;
  priceChange.textContent = `${change > 0 ? "+" : ""}${formatPrice(change)}`;
  changeCaption.textContent =
    entries.length > 1 ? `Since ${formatDate(first.date)}` : "Need another entry to compare";

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
      note.textContent = "Arizona iced tea";

      const amount = document.createElement("span");
      amount.className = "history-amount";
      amount.textContent = formatPrice(entry.price);

      const remove = document.createElement("button");
      remove.className = "delete-entry";
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Delete price from ${formatDate(entry.date)}`);
      remove.addEventListener("click", () => {
        const updated = entries.filter((item) => item.id !== entry.id);
        try {
          saveEntries(updated);
          message.textContent = "";
          render(updated);
        } catch {
          message.textContent = "Could not update saved prices. Please try again.";
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
  message.textContent = "Could not load saved prices. Your browser storage may be unavailable.";
}

priceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "";

  const price = Number(priceInput.value);
  const date = dateInput.value;
  if (!Number.isFinite(price) || price < 0.01 || price > 9999.99 || !date) {
    message.textContent = "Enter a price between $0.01 and $9,999.99, and choose a date.";
    return;
  }

  try {
    const entries = loadEntries();
    entries.push({ id: crypto.randomUUID(), price, date });
    saveEntries(entries);
    priceForm.reset();
    dateInput.value = localToday();
    render(entries);
  } catch {
    message.textContent = "Could not save this price. Please check your browser storage and try again.";
  }
});
