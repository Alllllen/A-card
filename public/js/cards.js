/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const acceptFriend = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/relations/agreeRelation/`,
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

export const disacceptFriend = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/relations/disagreeRelation/`,
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
