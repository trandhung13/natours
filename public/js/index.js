/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { booktour } from './stripe';
import { alert } from './alert';

const $ = document.querySelector.bind(document);

// DOM ELEMENTS
const loginForm = $('.form--login');
const map = $('#map');
const logOutBtn = $('.nav__el--logout');
const updateDataBtn = $('.btn--save--settings');
const updatePasswordForm = $('.form-user-password');
const userImgEl = $('.form__user-photo');
const userImgInputEl = $('#photo');
const bookBtn = $('#book-tour');
const alertMessage = $('body').dataset.alert;

const handleDisplayUserPhoto = e => {
  const imgFile = e.target.files?.[0];

  if (!imgFile?.type.startsWith('image/')) return;
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    userImgEl.setAttribute('src', reader.result);
  });

  reader.readAsDataURL(imgFile);
};

// DELEGATION
if (userImgInputEl)
  userImgInputEl.addEventListener('change', handleDisplayUserPhoto);

if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#email').value;
    const password = $('#password').value;
    login(email, password);
  });

if (logOutBtn)
  logOutBtn.addEventListener('click', e => {
    logout();
  });

if (updateDataBtn)
  updateDataBtn.addEventListener('click', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', $('#name').value);
    form.append('email', $('#email').value);
    form.append('photo', $('#photo').files[0]);

    updateSettings(form, 'data');
  });

if (updatePasswordForm)
  updatePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    $('.btn--save--password').innerHTML = 'Updating....';
    const passwordCurrent = $('#password-current').value;
    const newPassword = $('#password').value;
    const newPasswordConfirm = $('#password-confirm').value;
    await updateSettings(
      { passwordCurrent, newPassword, newPasswordConfirm },
      'password'
    );
    $('.btn--save--password').innerHTML = 'Save password';
  });

if (bookBtn)
  bookBtn.addEventListener('click', async e => {
    e.preventDefault();
    const { tourId } = e.target.dataset;
    e.target.innerHTML = 'Processing...';
    await booktour(tourId);
  });

if (alertMessage) showAlert('success', alertMessage, 10);
