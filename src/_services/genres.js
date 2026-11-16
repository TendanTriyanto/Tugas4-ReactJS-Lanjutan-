import API from '../_api';

export const getGenres = async () => {
  const { data } = await API.get('/genres');
  return data;
};

export const createGenre = async (payload) => {
  const { data } = await API.post('/genres', payload);
  return data;
};

export const updateGenre = async (id, payload) => {
  const { data } = await API.put(`/genres/${id}`, payload);
  return data;
};

export const deleteGenre = async (id) => {
  const { data } = await API.delete(`/genres/${id}`);
  return data;
};
