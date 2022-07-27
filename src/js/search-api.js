import axios from 'axios';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events';
const BASE_URL_COUNTRY = 'https://restcountries.com/v3.1/all';
const API_KEY = '5S5NkxMGWeNakzGTl4GGmpGuG9BFHdLG';

export const fetchCardsByName = query => {
  return axios.get(`${BASE_URL}`, {
    params: {
      apikey: API_KEY,
      keyword: query,
    },
  });
};

export const fetchCardsByCountry = query => {
  return axios.get(`${BASE_URL_COUNTRY}`, {
    params: {
      locale: query,
    },
  });
};
