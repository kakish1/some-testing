import axios from "axios";

export const useApi = () => {
  const token = localStorage.getItem("token");

  const api = axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    baseURL: "http://130.193.46.247:8000",
  });

  const handleResponse = (response) => response.data;

  const handleError = (error) => {
    if (error.response) {
      // Сервер вернул ответ с ошибкой
      console.error(
        "API Error:",
        error.response.data.message || error.response.statusText
      );
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Запрос был сделан, но ответа не было получено
      console.error("Network Error:", error.message);
      return Promise.reject({
        message: "Network error. Please try again later.",
      });
    } else {
      // Ошибка при настройке запроса
      console.error("Error:", error.message);
      return Promise.reject({ message: error.message });
    }
  };

  const auth = async (body) => {
    const formData = new URLSearchParams();
    formData.append("username", body?.username);
    formData.append("password", body?.password);
    return await api
      .post("http://130.193.46.247:8000/auth/token", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(handleResponse)
      .catch(handleError);
  };

  const createUser = async (body) => {
    return await api
      .post("/users/", body)
      .then(handleResponse)
      .catch(handleError);
  };

  const deleteUser = async (id) => {
    return await api
      .delete(`/users/${id}`)
      .then(handleResponse)
      .catch(handleError);
  };

  const getContent = async (body) => {
    return await api
      .get("/contents/", body)
      .then(handleResponse)
      .catch(handleError);
  };

  const postContent = async (body) => {
    return await api
      .post("/contents/", body)
      .then(handleResponse)
      .catch(handleError);
  };

  const getContentById = async (id) => {
    return await api
      .get(`http://130.193.46.247:8000/contents/${id}`)
      .then(handleResponse)
      .catch(handleError);
  };

  const updateContentById = async (id, body) => {
    return await api
      .put(`/contents/${id}`, body)
      .then(handleResponse)
      .catch(handleError);
  };

  const uploadPdf = async (title = "", body) => {
    return await api
      .post(
        `http://130.193.46.247:8000/contents/upload_pdf/?title=${title}`,
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(handleResponse)
      .catch(handleError);
  };

  const updateContentTitle = async (id, title) => {
    return await api
      .post(`/contents/${id}/update_title?title=${title}`, {})
      .then(handleResponse)
      .catch(handleError);
  };

  return {
    auth,
    createUser,
    deleteUser,
    getContent,
    getContentById,
    postContent,
    updateContentById,
    uploadPdf,
    updateContentTitle,
  };
};
