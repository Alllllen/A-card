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
