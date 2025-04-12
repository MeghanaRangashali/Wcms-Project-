const handleErrors = async (res) => {
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Data Load Error");
  }
  return res.json();
};

// Load the local mock JSON data once and reuse
let cachedData = null;

const loadData = async () => {
  if (!cachedData) {
    const res = await fetch(API_BASE);
    cachedData = await handleErrors(res);
  }
  return cachedData;
};

// Sort by total cases (like /countries?sort=cases)
const fetchCountries = async () => {
  const data = await loadData();
  return [...data.countries].sort((a, b) => b.cases - a.cases);
};

// Sort by total deaths (like /countries?sort=deaths)
const fetchDeaths = async () => {
  const data = await loadData();
  return [...data.countries].sort((a, b) => b.deaths - a.deaths);
};

// Global summary (like /all)
const fetchGlobal = async () => {
  const data = await loadData();
  return data.global;
};

const aliasMap = {
  USA: "United States",
  UK: "United Kingdom",
  "U.S.": "United States",
};

// Historical data by country (like /historical/:country?lastdays=30)

const fetchHistorical = async (country = "United States") => {
  const data = await loadData();
  const normalized = aliasMap[country] || country;
  return data.historical[normalized] || null;
};

// Continent-level cases (like /continents)
const fetchContinents = async () => {
  const data = await loadData();
  return data.continents;
};
