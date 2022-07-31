'use strict';

import axios from 'axios';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events';
const API_KEY = '5S5NkxMGWeNakzGTl4GGmpGuG9BFHdLG';

export const fetchCardsByName = (keyword, countryCode, page) => {
  const params = {
    apikey: API_KEY,
    keyword: keyword,
    size: 16,
    page: page,
  };
  if (countryCode.length) {
    params.countryCode = countryCode;
  }
  return axios.get(`${BASE_URL}`, { params });
};

export const fetchCardById = id => {
  const params = {
    apikey: API_KEY,
  };

  return axios.get(`${BASE_URL}/${id}`, { params });
};
