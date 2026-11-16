import API from '../_api';

export const getUsers = async () => {
  const { data } = await API.get('/users');
  return data;
};
