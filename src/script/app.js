let countryHolder;
let amountHolder;

const localKey = "travel-planner";

const exist = () => {
  //true false
  return localStorage.hasOwnProperty(localKey);
};

const hasItem = (key) => {
  //true false
  let countries = getAllItems();
  return countries.includes(key);
};

const updateCounter = () => {
  amountHolder.innerHTML = countItems();
};

const addItem = (key) => {
  //void
  if (!exist()) {
    localStorage.setItem(localKey, JSON.stringify([]));
  }
  let countries = getAllItems(); // Array
  console.log(countries);
  countries.push(key); // Nieuw item toevoegen
  localStorage.setItem(localKey, JSON.stringify(countries));
};

const getAllItems = () => {
  return JSON.parse(localStorage.getItem(localKey)) || [];
};

const removeItem = (key) => {
  //void
  const index = getAllItems().indexOf(key); // Waar staat het land wat weg mag?
  let savedCountries = getAllItems();
  savedCountries.splice(index, 1); // Verwijder dat item in de array.
  localStorage.setItem(localKey, JSON.stringify(savedCountries));
};

const countItems = () => {
  //integer
  return getAllItems().length;
};

const showCountries = (data) => {
  let countries = "";

  const country = document.querySelector(".js-country-holder");
  for (const c of data) {
    countries += `
        <article>
            <input type="checkbox" class="o-hide c-country-input" id="${
              c.cioc
            }-${c.alpha2Code}"
             ${hasItem(c.cioc + "-" + c.alpha2Code) ? 'checked="checked"' : ""}>
            <label for="${c.cioc}-${
      c.alpha2Code
    }" class="c-country js-country" data-country-name="${c.name}">
                <div class="c-country-header">
                    <h2 class="c-country-header__name">${c.name}</h2>
                    <img crossorigin="anonymous"  src="https://countryflagsapi.com/svg/${
                      c.alpha3Code
                    }" alt="The flag of ${
      c.name
    }" class="c-country-header__flag">
                </div>
                <p class="c-country__native-name">${c.altSpellings[2]}</p>
            </label>
    </article>
        `;
  }
  countryHolder.innerHTML = countries;

  // HTML is loaded.
  addListenersToCountries(".js-country");
};

const addListenersToCountries = (classSelector) => {
  const countries = document.querySelectorAll(classSelector);

  for (const country of countries) {
    country.addEventListener("click", function (e) {
      console.log({
        country,
      });
      const countryKey = this.getAttribute("for"); // For heeft de correcte en unieke key
      if (hasItem(countryKey)) {
        console.log("delete ", countryKey);
        removeItem(countryKey);
      } else {
        console.log("Add ", countryKey);
        addItem(countryKey);
        showNotification(country);
      }
      updateCounter();
    });
  }
};

const fadeAndRemoveNotification = (notification) => {
  notification.classList.add("u-fade-out");
  setTimeout(() => {
    document.querySelector(".js-notification-holder").removeChild(notification);
  }, 800);
};

const showNotification = (element) => {
  // 1 Show in js-notification-holder;
  let notification = document.createElement("div");
  console.log(element.getAttribute("for"));
  notification.classList.add("c-notification");
  notification.innerHTML = `
    <h2 class="c-notification__header">You have selected ${element.dataset.countryName}.</h2>
    <button  class="c-notification__action">undo</button>
  `;
  document.querySelector(".js-notification-holder").append(notification);

  // 2 Fade out after 800ms
  setTimeout(() => {
    fadeAndRemoveNotification(notification);
  }, 1500);
};

const fetchCountries = (region) => {
  fetch(
    `http://api.countrylayer.com/v2/region/${region}?access_key=c3f696dc3a6986b80659530cff512f88`
  )
    .then((r) => r.json())
    .then((data) => showCountries(data))
    .catch((error) => console.log("An error occured, " + error));
};

const enableListeners = () => {
  const regionButtons = document.querySelectorAll(".js-region-select");

  for (const button of regionButtons) {
    button.addEventListener("click", function () {
      console.log(this.getAttribute("data-region"));
      const region = this.getAttribute("data-region");

      fetchCountries(region);
    });
  }
  countryHolder = document.querySelector(".js-country-holder");
  amountHolder = document.querySelector(".js-amount");
  fetchCountries("europe");
  updateCounter();
};

const init = () => {
  console.log("Welcome👍 windows button + ;");
  enableListeners();
};

document.addEventListener("DOMContentLoaded", init);
