/* eslint-disable */
import '@babel/polyfill';
import { login, logout, regist } from './login';
import { updateSettings } from './updateSettings';
import { create, createComment } from './posts';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const registForm = document.querySelector('.form--regist');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const creatPostForm = document.querySelector('.form--creatPost');
const creatCommentForm = document.querySelector('.form--comment');

const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (registForm)
  registForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordComfirm = document.getElementById('passwordComfirm').value;
    regist(name, email, password, passwordComfirm);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    // form.append('photo', document.getElementById('photo').files[0]);
    updateSettings({ name, email }, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// if (bookBtn)
//   bookBtn.addEventListener('click', (e) => {
//     e.target.textContent = 'Processing...';
//     const { tourId } = e.target.dataset;
//     bookTour(tourId);
//   });

if (creatPostForm)
  creatPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const select = document.getElementById('board').value;
    // const boarId = select.options[select.selectedIndex].value;
    const tag = document.getElementById('tag').value;
    create(title, content, select, tag);
  });
if (creatCommentForm)
  creatCommentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('comment').value;
    createComment(content);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
