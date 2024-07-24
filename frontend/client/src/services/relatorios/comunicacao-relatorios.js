import axios from 'axios';
import { useAuthStore } from '@/store';
import NProgress from '../../plugins/nprogress';

const baseURL = 'http://localhost:3000/';

const obterToken = () => {
  const authStore = useAuthStore();
  return authStore.getToken();
};

const instancia = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'blob',
});

instancia.interceptors.request.use(
  (config) => {
    NProgress.start();
    const token = obterToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    } else {
      this.$router.push('/login');
      NProgress.done();
      return Promise.reject(
        new Error('Token não disponível. Redirecionando para login.'),
      );
    }
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

instancia.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

export const emissaoProdutos = (modelo) => {
  return instancia.post(`/excel/produtos`, modelo);
};

export const emissaoMovimentacoes = (modelo) => {
  return instancia.post(`/excel/movimentacoes`, modelo);
};
