import axios from 'axios';
import { useAuthStore } from '@/store';

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

export const emissaoProdutosPorEstoque = (modelo) => {
  return instancia.post(`/excel/produtos-por-estoque`, modelo);
};

export const emissaoMovimentacoes = (modelo) => {
  return instancia.post(`/excel/movimentacoes`, modelo);
};
