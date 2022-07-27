import { fetchCardsByName, fetchCardsByCountry } from './search-api';
import listCountries from '../templates/list-countries.hbs';

const formEl = document.querySelector('.search-form');

console.dir(formEl);

const onSearchFormSubmit = async event => {
  event.preventDefault();
  const query = formEl.elements.query.value;

  try {
    const {
      data: {
        _embedded: { events },
      },
    } = await fetchCardsByName(query);
    console.log(events);
    //!!! events-передає масив об*єктів
  } catch (err) {
    console.log(err);
  }
};

const onSearchCountries = async event => {
  event.preventDefault();
  const query = formEl.elements.country.value;
  console.log(query);
  try {
    const { data } = await fetchCardsByCountry(query);
    console.log(listCountries(data));
    formEl.lastElementChild.innerHTML = listCountries(data);
  } catch (err) {
    console.log(err);
  }
};

formEl.addEventListener('submit', onSearchFormSubmit);
formEl.elements.country.addEventListener('input', onSearchCountries);
