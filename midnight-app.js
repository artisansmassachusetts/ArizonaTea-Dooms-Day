const priceElement =
  document.querySelector("#chaos-price");

const tickerElement =
  document.querySelector("#news-ticker");

const warningElement =
  document.querySelector("#warning");

const storyElement =
  document.querySelector("#story");

const achievementsElement =
  document.querySelector("#achievements");

let price = 1.00;

const headlines = [
  "BREAKING: Arizona Tea surpasses gold.",
  "BREAKING: Analysts raise target price to 'yes'.",
  "BREAKING: Beverage markets enter historic rally.",
  "BREAKING: Citizens begin storing tea in vaults.",
  "BREAKING: Arizona Tea added to retirement portfolios.",
  "BREAKING: Gold investors pivot to iced tea.",
  "BREAKING: Economists remain confused.",
  "BREAKING: Beverage sector becomes market leader.",
  "BREAKING: Arizona Tea futures surge overnight.",
  "BREAKING: Markets temporarily halt for hydration.",
  "BREAKING: The Arizona Standard replaces the gold standard.",
  "BREAKING: Time itself now tracks tea futures."
];

const warnings = [
  "The Arizona Tea price is no longer stable.",
  "Analysts advise remaining calm.",
  "The market has entered uncharted territory.",
  "Nobody expected this outcome.",
  "Merchants are updating signs continuously.",
  "One minute changed everything.",
  "The 99¢ era has officially ended."
];

const stories = [
  "The clock moved one minute. Nobody was prepared for what happened next.",
  "Collectors now insure individual cans.",
  "Economists are revising every model they have.",
  "Historians debate whether the 99¢ can ever truly existed.",
  "Entire investment funds are benchmarked against Arizona Tea.",
  "Convenience stores report unprecedented demand.",
  "The beverage economy has diverged from reality.",
  "Ordinary tea drinkers have become unlikely market experts.",
  "Financial news channels now dedicate hourly tea coverage.",
  "Nobody can explain why the chart keeps going up."
];

const achievementData = [
  {
    amount: 10,
    title: "☕ First Price Movement"
  },
  {
    amount: 100,
    title: "📈 Double Digits"
  },
  {
    amount: 1000,
    title: "💸 Four Figure Beverage"
  },
  {
    amount: 10000,
    title: "🏦 Institutional Tea"
  },
  {
    amount: 100000,
    title: "🌎 Global Commodity"
  },
  {
    amount: 1000000,
    title: "🚀 Seven Figure Sip"
  },
  {
    amount: 10000000,
    title: "🪐 Interplanetary Asset"
  },
  {
    amount: 100000000,
    title: "👑 Beverage Royalty"
  },
  {
    amount: 1000000000000,
    title: "⏰ The Clock Was Right"
  }
];

const unlocked =
  new Set();

function formatPrice(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }
  ).format(value);

}

function renderPrice() {

  priceElement.textContent =
    formatPrice(price);

}

function unlockAchievements() {

  achievementData.forEach(
    (achievement) => {

      if (
        price >= achievement.amount &&
        !unlocked.has(
          achievement.title
        )
      ) {

        unlocked.add(
          achievement.title
        );

        const item =
          document.createElement(
            "div"
          );

        item.textContent =
          achievement.title;

        achievementsElement.append(
          item
        );

      }

    }
  );

}

function updateHeadline() {

  tickerElement.textContent =
    headlines[
      Math.floor(
        Math.random() *
        headlines.length
      )
    ];

}

function updateStory() {

  warningElement.textContent =
    warnings[
      Math.floor(
        Math.random() *
        warnings.length
      )
    ];

  storyElement.textContent =
    stories[
      Math.floor(
        Math.random() *
        stories.length
      )
    ];

}

function increasePrice() {

  const multiplier =
    2 +
    Math.random() * 2;

  price =
    price * multiplier;

  renderPrice();

  unlockAchievements();

}

renderPrice();

unlockAchievements();

updateHeadline();

updateStory();

setInterval(
  increasePrice,
  600
);

setInterval(
  updateHeadline,
  5000
);

setInterval(
  updateStory,
  7000
);
