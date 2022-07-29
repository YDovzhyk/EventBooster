'use strict';

import { fetchCardsByName } from './search-api';
import listCountries from '../templates/list-сountries.hbs';
import cardsRender from '../templates/cards-render.hbs';
import * as listCountriesJson from '../json/countries-list.json';

import swal from 'sweetalert';

import customSelect from 'custom-select';
import { pageMenu } from './pagination';

const formEl = document.querySelector('.search__form');
const selectEl = document.querySelector('.search__select');
const conteinerEl = document.querySelector('.event .event__container');

formEl.lastElementChild.insertAdjacentHTML(
  'beforeend',
  listCountries(listCountriesJson)
);

const select = customSelect('select')[0];

fetchCardsByName('', 'ca')
  .then(response => {
    const result = response.data._embedded.events;
    conteinerEl.innerHTML = cardsRender(result);
  })
  .catch(error => console.log(error));

const onSearchFormSubmit = async event => {
  event.preventDefault();
  const query = formEl.elements.query.value;
  const locale = formEl.elements.countrySelect.value;
  console.log('locale', locale);

  try {
    const { data } = await fetchCardsByName(query, locale);

    if (data.page.totalElements === 0) {
      swal('There are no events in this country', {
        closeOnClickOutside: true,
        closeOnEsc: true,
        buttons: false,
      });

      select.value = '';
      formEl.reset();
      fetchCardsByName('', 'ca')
        .then(response => {
          const result = response.data._embedded.events;
          conteinerEl.innerHTML = cardsRender(result);
        })
        .catch(error => console.log(error));

      return;
    }

    const result = data._embedded;

    conteinerEl.innerHTML = cardsRender(result.events);

    const pagination = pageMenu(data.page.totalElements / 16);
    pagination.on('beforeMove', async function (eventData) {
      console.log('Go to page ' + eventData.page + '?');
      const page = eventData.page;
      try {
        const { data } = await fetchCardsByName(query, locale, page);
        const result = data._embedded;
        conteinerEl.innerHTML = cardsRender(result.events);
      } catch (err) {
        console.log(err);
      }
    });

    formEl.elements.query.value = '';
  } catch (err) {
    console.log(err);
  }
};

formEl.addEventListener('submit', onSearchFormSubmit);
selectEl.addEventListener('change', onSearchFormSubmit);
