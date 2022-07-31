import modal from '../templates/modal.hbs';
import { fetchCardById, fetchCardsByName } from './search-api';
import cardsRender from '../templates/cards-render.hbs';
import { pageMenu } from './pagination';

const eventEl = document.querySelector('.event');
const modalBackdropEl = document.querySelector('.backdrop');
const conteinerEl = document.querySelector('.event .event__container');
let currentAuthor;

const openModal = event => {
  // if path attribute contains event__item class, this is event card
  // so select it to get event id from data attribute
  const eventCardEl = event.path.find(elem => {
    return elem.classList?.contains('event__item');
  });

  if (eventCardEl) {
    modalBackdropEl.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';

    fetchCardById(eventCardEl.dataset.eventId)
      .then(response => {
        const result = response.data;

        const formatData = {
          info: result.name,
          when: result.dates.start.localDate,
          whenTime: function emtyData() {
            if (result.dates.start.localTime) {
              return `${result.dates.start.localTime.slice(
                0,
                -3
              )} (${result.dates.timezone?.replace('_', ' ')})`;
            } else {
              return "Sorry we don't have information";
            }
          },
          where: `${result._embedded.venues[0].city.name}, ${result._embedded.venues[0].country.name}`,
          whereName: result._embedded.venues[0].name,
          who: result._embedded.attractions
            ? result._embedded.attractions[0].name
            : '',
          prices: result.priceRanges?.map(({ max, min, type, currency }) => {
            if (!result.priceRanges.length === 1) {
              return "Sorry we don't have information";
            } else {
              return { title: `${type} ${min}-${max} ${currency}` };
            }
          }),
          image: result.images[0].url,
          buyTicket: result.url,
        };
        currentAuthor = result._embedded.attractions
          ? result._embedded.attractions[0].name
          : result.name;
        modalBackdropEl.innerHTML = modal(formatData);
      })
      .catch(error => console.log(error));
  }
};

eventEl.addEventListener('click', openModal);

function closeModal() {
  modalBackdropEl.innerHTML = '';
  modalBackdropEl.classList.add('is-hidden');
  document.body.style.overflow = 'scroll';
}

modalBackdropEl.addEventListener('click', event => {
  const isBackdrop = event.target.classList.contains('backdrop');
  const isModalButtonClose = event.path.some(elem => {
    return elem.classList?.contains('modal__btn-close');
  });

  if (isModalButtonClose || isBackdrop) {
    closeModal();
  }
});

modalBackdropEl.addEventListener('click', async event => {
  const isMoreButton = event.path.some(elem => {
    return elem.classList?.contains('more-btn');
  });

  if (isMoreButton) {
    const response = await fetchCardsByName(currentAuthor, '');
    const result = response.data._embedded.events;
    conteinerEl.innerHTML = cardsRender(result);
    const pagination = pageMenu(response.data.page.totalElements);
    pagination.on('beforeMove', async function (eventData) {
      const page = eventData.page;
      try {
        const response = await fetchCardsByName(currentAuthor, '', page);
        const result = response.data._embedded.events;
        conteinerEl.innerHTML = cardsRender(result);
      } catch (err) {
        console.log(err);
      }
    });

    closeModal();
  }
});
