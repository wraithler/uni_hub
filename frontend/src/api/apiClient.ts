import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

function getCSRFToken() {
  const name = "csrftoken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return "";
}

api.defaults.xsrfHeaderName = "X-CSRFToken";
api.defaults.xsrfCookieName = "csrftoken";

api.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      (error.response && error.response.status == 401) ||
      error.response.status == 403
    ) {
      window.location.href = "/login";
    }

    if (error.response && error.response.status == 404) {
      window.location.href = "/404";
    }
    return Promise.reject(error);
  },
);

export default api;
