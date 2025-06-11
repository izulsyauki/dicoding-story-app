
import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

const ENDPOINTS = {
  // Auth
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  MY_USER_INFO: `${CONFIG.BASE_URL}/users/me`,

  // Stories
  STORIES_LIST: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: `${CONFIG.BASE_URL}/stories/`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,

  // Subscription
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
}

async function getRegistered({ name, email, password }) {
  try {
    const data = JSON.stringify({ name, email, password });

    const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

async function getLogin({ email, password }) {
  try {
    const data = JSON.stringify({ email, password });

    const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });
    const json = await fetchResponse.json();

    if (!json.error && fetchResponse.ok) {
      localStorage.setItem('token', json.loginResult.token);
      localStorage.setItem('user', JSON.stringify({
        id: json.loginResult.userId,
        name: json.loginResult.name,
      }));
    }

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

async function getAllStories(page = 1, size = 10) {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return {
        error: true,
        message: 'Tidak ada token autentikasi',
      }
    }

    const fetchResponse = await fetch(`${ENDPOINTS.STORIES_LIST}?page=${page}&size=${size}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

async function getStoryDetail(id) {
  try {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return {
        error: true,
        message: 'Tidak ada token autentikasi',
      }
    }

    const response = await fetch(`${ENDPOINTS.STORY_DETAIL}${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

async function addStory({ description, photo, lat, lon }) {
  try {
    const accessToken = getAccessToken();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);

    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const fetchResponse = await fetch(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

const API = {
  register: getRegistered,
  login: getLogin,
  getAllStories,
  getStoryDetail,
  addStory,
  subscribePushNotification,
  unsubscribePushNotification
};

export default API;