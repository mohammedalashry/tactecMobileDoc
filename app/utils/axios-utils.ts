import axios from 'axios';
const client = axios.create({baseURL: process.env.API_URL});

export const axiosInterceptor = ({...options}) => {
  // token came from localStorage
  client.defaults.headers.common.Authorization = `Bearer ${options.token}`;
  const onSuccess = response => response;
  const onError = err => {
    // optionally catch error and add additional logging here
    return err;
  };

  return client(options).then(onSuccess).catch(onError);
};
