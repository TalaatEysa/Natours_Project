import '@babel/polyfill';
import { displayMap } from './mapbox.js';
import { login } from './login.js';

//Dom Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');


if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    document.querySelector('.form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    login(email, password);
  });
}