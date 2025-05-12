const axios = require('axios');
const NodeCache = require('node-cache');

// Cache instance with 24 hour TTL
const countryCache = new NodeCache({ stdTTL: 86400 });
const COUNTRIES_API_BASE = 'https://restcountries.com/v3.1';

// Helper function to format country data
const formatCountryData = (country) => ({
  name: country.name.common,
  flag_url: country.flags.svg,
  currency: Object.values(country.currencies || {})[0]?.name || 'N/A',
  capital: country.capital?.[0] || 'N/A'
});

// Get all countries
exports.getAllCountries = async (req, res) => {
  try {
    // Check cache first
    let countries = countryCache.get('all_countries');

    if (!countries) {
      // Fetch from API if not in cache
      const response = await axios.get(`${COUNTRIES_API_BASE}/all`);
      countries = response.data.map(country => ({
        name: country.name.common
      }));

      // Store in cache
      countryCache.set('all_countries', countries);
    }

    res.json({ countries });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Error fetching countries' });
  }
};

// Get specific country by name
exports.getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const cacheKey = `country_${name.toLowerCase()}`;

    // Check cache first
    let countryData = countryCache.get(cacheKey);

    if (!countryData) {
      // Fetch from API if not in cache
      const response = await axios.get(`${COUNTRIES_API_BASE}/name/${name}`);
      
      if (!response.data || response.data.length === 0) {
        return res.status(404).json({ message: 'Country not found' });
      }

      countryData = formatCountryData(response.data[0]);
      
      // Store in cache
      countryCache.set(cacheKey, countryData);
    }

    res.json(countryData);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Country not found' });
    }
    console.error('Error fetching country:', error);
    res.status(500).json({ message: 'Error fetching country data' });
  }
};