import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputSearchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearchBox.addEventListener(
  'input',
  debounce(onDataInput, DEBOUNCE_DELAY)
);

function onDataInput() {
  const countryNameInput = inputSearchBox.value.trim();
  clearData();
  if (countryNameInput !== '') {
    fetchCountries(countryNameInput)
      .then(countriesArray => {
        if (countriesArray.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (countriesArray.length >= 2 && countriesArray.length <= 10) {
          renderCountriesList(countriesArray);
        }
        if (countriesArray.length === 1) {
          renderCountryInfo(countriesArray);
        }
        if (countriesArray.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      })
      .catch(error => {
        console.log(`This is error`, error);
      });

  }
}

function clearData() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountriesList(countries) {
  countries.map(country => {
    countryList.insertAdjacentHTML(
      'beforeend',
      `<li class="country-item">
        <img src=${country.flags.svg} 
        alt="country_flag" 
        width="50px">
        ${country.name.official}
        <li>`
    );
  });
}

function renderCountryInfo(country) {
  countryInfo.insertAdjacentHTML(
    'beforeend',
    ` <img src=${country[0].flags.svg} 
    alt="country_flag" 
    width="100px">
    <h2>${country[0].name.official}</h2> 
    <ul class='country-info-list'>
    <li>capital:
    <span class='country-info-item'>${country[0].capital}</span>
    </li>
    <li>population:
    <span class='country-info-item'>${country[0].population}</span>
    </li>
    <li>languages:
    <span class='country-info-item'>${Object.values(country[0].languages).join(', ')}</span>
    </li>
</ul>`
  );
}