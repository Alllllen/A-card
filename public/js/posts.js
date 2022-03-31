/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const create = async (title, content, board, tag) => {
  try {
    // user = res.locals.user;

    const res = await axios({
      method: 'POST',
      url: '/api/v1/posts/',
      data: {
        title,
        content,
        board,
        tag,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Post a post successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createComment = async (content) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1${window.location.pathname}/comments/`,
      data: {
        content,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'post a comment successfully!');
      window.setTimeout(() => {
        location.assign(window.location);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updateLike = async () => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/posts/like/`,
      data: {
        post: window.location.pathname.split('/')[2],
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `updated successfully!`);
      window.setTimeout(() => {
        location.assign(window.location);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deletePost = async (postid) => {
  try {
    const res = await axios({
      method: 'Delete',
      url: `/api/v1/posts/${postid}`,
    });
    console.log(res.status === 204);
    if (res.status === 204) {
      showAlert('success', `Delete successfully!`);
      window.setTimeout(() => {
        location.assign(window.location);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
