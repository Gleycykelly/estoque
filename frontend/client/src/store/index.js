import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    getToken() {
      return this.token;
    },
    clearToken() {
      this.token = null;
    },
  },
});

export const useDadosStore = defineStore('dados', {
  state: () => ({
    dadosParaEdicao: null,
  }),
  actions: {
    salvarDadosParaEdicao(dados) {
      this.dadosParaEdicao = dados;
    },
  },
  getters: {
    getDadosParaEdicao() {
      return this.dadosParaEdicao;
    },
  },
});

export const useDadosDeOutraTela = defineStore('dadosOutraTela', {
  state: () => ({
    dadosDeOutraTela: [],
  }),
  actions: {
    adicionarDadosDeOutraTela(dadosOutraTela) {
      this.dadosDeOutraTela.push(dadosOutraTela);
    },
    retirarDadosDeOutraTela() {
      this.dadosDeOutraTela.pop();
    },
    finalizar() {
      this.dadosDeOutraTela = [];
    },
  },
  getters: {
    getDadosDeOutraTela() {
      return this.dadosDeOutraTela;
    },
    ultimoElemento() {
      if (this.dadosDeOutraTela.length < 1) return null;
      const ultimoIndice = this.dadosDeOutraTela.length - 1;
      return this.dadosDeOutraTela[ultimoIndice];
    },
  },
});

export const useAlerta = defineStore('alerta', {
  state: () => ({
    show: false,
    text: '',
    color: 'success',
    timeout: 6000,
  }),
  actions: {
    exibirSnackbar(texto, cor) {
      this.show = true;
      this.text = texto;
      this.color = cor;
    },
    fechar() {
      this.show = false;
    },
  },
});
