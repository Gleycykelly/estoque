import axios from 'axios';
import { useAuthStore } from '@/store';

const baseURL = 'http://localhost:3000/';

const obterToken = () => {
  const authStore = useAuthStore();
  return authStore.getToken();
};

const comunicacaoAbstrata = (caminho) => {
  const instancia = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.obterToken()}`,
    },
  });

  instancia.interceptors.request.use(
    (config) => {
      const token = obterToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      } else {
        this.$router.push('/login');
        return Promise.reject(
          new Error('Token não disponível. Redirecionando para login.'),
        );
      }
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return {
    criar: (modelo) => instancia.post(`${caminho}/`, modelo),
    atualizar: (id, modelo) => instancia.patch(`${caminho}/${id}`, modelo),
    obterPorId: (id) => instancia.get(`${caminho}/${id}`),
    obterTodos: () => instancia.get(`${caminho}/`),
  };
};

export default comunicacaoAbstrata;
