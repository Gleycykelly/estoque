import axios from 'axios';

const baseURL = 'http://localhost:3000/';

const instancia = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (modelo) => {
  return instancia.post(`/autenticacao/entrar/`, modelo);
};
