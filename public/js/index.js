/* eslint-disable */
import '@babel/polyfill';
import { login, logout, regist } from './login';
import { updateSettings } from './updateSettings';
import { create, createComment, updateLike, deletePost } from './posts';
import { showAlert } from './alerts';

// DOM ELEMENTS
const registForm = document.querySelector('.form--regist');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const creatPostForm = document.querySelector('.form--creatPost');
const creatCommentForm = document.querySelector('.form--comment');
const updateLikeForm = document.querySelector('.form--like');

const deletePostForm = document.querySelector('.form--deletePost');

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

if (creatPostForm)
  creatPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const select = document.getElementById('board').value;
    const tag = '6241a903ee80052724ffd88b';
    // const tag = document.getElementById('tag').value;
    create(title, content, select, tag);
  });
if (creatCommentForm)
  creatCommentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = document.getElementById('comment').value;
    createComment(content);
  });
if (updateLikeForm)
  updateLikeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    updateLike();
  });

if (deletePostForm) {
  console.log(deletePostForm);
  deletePostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    deletePost(e.submitter.id);
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
