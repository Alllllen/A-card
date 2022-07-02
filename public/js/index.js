/* eslint-disable */
import '@babel/polyfill';
import { login, logout, regist } from './login';
import { updateSettings } from './updateSettings';
import { create, createComment, deletePost, updateLike } from './posts';
import { disacceptFriend, acceptFriend } from './cards';
import { message } from './message';
import { showAlert } from './alerts';

// DOM ELEMENTS
const registForm = document.querySelector('.form--regist');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
//寫文章、留言
const creatPostForm = document.querySelector('.form--creatPost');
const creatCommentForm = document.querySelector('.form--comment');
// 案文章讚
const updateLikeForm = document.querySelector('.form--like');
//抽卡
const agreeFriendForm = document.querySelector('.agreeFriend');
const disagreeFriendForm = document.querySelector('.disagreeFriend');
//刪除貼文
const deletePostForm = document.querySelector('.form--deletePost');

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
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
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
//POST
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
  // console.log(deletePostForm);
  deletePostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    deletePost(e.submitter.id);
  });
}
//抽卡
if (agreeFriendForm)
  agreeFriendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    acceptFriend();
  });

if (disagreeFriendForm)
  disagreeFriendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    disacceptFriend();
  });
//上傳照片POST
const image_input = document.querySelector('#photo');
var uploaded_image;
if (image_input)
  image_input.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      uploaded_image = reader.result;
      document.querySelector(
        `#display_image`
      ).style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
  });
const postImage_input = document.querySelector('#postImage');
let images = [];
if (postImage_input)
  postImage_input.addEventListener('change', function () {
    image_select();
    console.log(images);
  });
function image_select() {
  var image = document.getElementById('postImage').files;
  for (let i = 0; i < image.length; i++) {
    if (check_duplicate(image[i].name)) {
      images.push({
        name: image[i].name,
        url: URL.createObjectURL(image[i]),
        file: image[i],
      });
    } else {
      alert(image[i].name + ' is already added to the list');
    }
  }
  // document.getElementById('form').reset();
  document.getElementById('container').innerHTML = image_show();
}
function image_show() {
  var image = '';
  images.forEach((i) => {
    image +=
      `<div class="image_container d-flex justify-content-center position-relative">
            <img src="` +
      i.url +
      `" alt="Image">
        </div>`;
  });
  return image;
}
function check_duplicate(name) {
  var image = true;
  if (images.length > 0) {
    for (let e = 0; e < images.length; e++) {
      if (images[e].name == name) {
        image = false;
        break;
      }
    }
  }
  return image;
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
//socket.io
message();
