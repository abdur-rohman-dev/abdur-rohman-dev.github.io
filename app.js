const $ = (id) => document.getElementById(id);

const setSelect = (rates, id, currency) => {
  Object.entries(rates).forEach(([key, value]) => {
    const option = document.createElement("option");
    const select = $(id);

    option.value = value;
    option.innerHTML = key;
    option.selected = key == currency;

    select.append(option);
  });
};

const setFlag = (country, id) => {
  const currency = country.slice(0, 2);

  $(id).setAttribute("src", `https://www.countryflags.io/${currency}/flat/64.png`);
};

const setCountryName = async (country, top, bottom) => {
  const url = `https://restcountries.eu/rest/v2/alpha/${country.slice(0, 2)}`;
  const response = await fetch(url);
  const { name, currencies } = await response.json();

  $(top).innerHTML = name;
  $(bottom).innerHTML = currencies[0].name;
};

const convert = async () => {
  const baseSelect = $("currency-base-select");
  const targetSelect = $("currency-select");

  const baseCountry = baseSelect.options[baseSelect.selectedIndex].innerHTML;
  const targetCountry = targetSelect.options[targetSelect.selectedIndex].innerHTML;

  const base = $("currency").value;
  const result = base * (targetSelect.value / baseSelect.value);

  setFlag(baseCountry, "currency-base-flag");
  setFlag(targetCountry, "currency-select-flag");

  setCountryName(baseCountry, "base-name", "base-name-currency");
  setCountryName(targetCountry, "target-name", "target-name-currency");

  $("currency-result").value = result;
};

const change = () => {
  const baseSelect = $("currency-base-select");
  const targetSelect = $("currency-select");
  const temp = baseSelect.selectedIndex;

  baseSelect.selectedIndex = targetSelect.selectedIndex;
  targetSelect.selectedIndex = temp;

  convert();
}

(async () => {
  const url = "https://api.exchangeratesapi.io/latest?base=IDR";
  const response = await fetch(url);
  const { base, date, rates } = await response.json();

  const keys = Object.keys(rates);
  const target = keys[Math.floor(Math.random() * keys.length)];

  setSelect(rates, "currency-base-select", base);
  setSelect(rates, "currency-select", target == base ? keys[0] : target);

  $('date').innerHTML = date;

  convert();
})();
