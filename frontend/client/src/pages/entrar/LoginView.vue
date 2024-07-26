<template style="max-width: 1200px">
  <v-row class="vh-100">
    <v-col
      cols="12"
      md="5"
      class="d-flex justify-content-center align-items-center left-login"
    >
      <div class="text-center">
        <h2 class="title-login">Bem vindo(a)</h2>
        <v-form class="no-border" @submit.prevent="entrar">
          <v-text-field
            flat
            solo
            v-model="form.email"
            :rules="[(v) => !!v || 'O E-mail é obrigatório!']"
            label="E-mail"
            required
            rounded="lg"
            placeholder="Digite seu e-mail"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            flat
            solos
            v-model="form.senha"
            :rules="[(v) => !!v || 'A senha é obrigatória!']"
            label="Senha"
            type="password"
            required
            placeholder="Digite sua senha"
            rounded="lg"
            variant="outlined"
          ></v-text-field>
          <v-btn
            class="botao-entrar"
            variant="elevated"
            rounded="lg"
            type="submit"
            block
          >
            Entrar
          </v-btn>
        </v-form>
      </div>
    </v-col>
    <v-col
      cols="12"
      md="7"
      class="d-none d-sm-none d-md-block rigth-login gradient-background"
      style="position: relative"
    >
      <div class="imagem-principal">
        <p>
          Seu estoque sob
          <span class="underline">controle,</span>
        </p>
        <p>seu negócio em ALTA!</p>
      </div>
      <div class="container-imagem-login">
        <img :src="imagemURL" alt="Logo" class="imagem-login" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { login } from '@/services/autenticacao/comunicacao-autenticacao';
import { useAuthStore, useAlerta } from '@/store/index';
import logo from '@/assets/imagem-principal.png';

export default {
  name: 'login-view',
  data() {
    return {
      form: {
        email: '',
        senha: '',
      },
      imagemURL: logo,
    };
  },
  methods: {
    async entrar() {
      if (!this.form.email) {
        useAlerta().exibirSnackbar('O e-mail é obrigatório', 'red');
        return;
      }

      if (!this.form.senha) {
        useAlerta().exibirSnackbar('A senha é obrigatória', 'red');
        return;
      }

      login({
        email: this.form.email,
        senha: this.form.senha,
      })
        .then((response) => {
          const token = response.data;

          const authStore = useAuthStore();
          authStore.setToken(token);

          if (token && this.$router) {
            this.$router.push('/home');
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            useAlerta().exibirSnackbar(error.response.data.message, 'red');
          } else {
            useAlerta().exibirSnackbar(error.message, 'red');
          }
        });
    },
  },
};
</script>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

.left-login {
  background-color: #f2f2f2;
}

.rigth-login {
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.gradient-background {
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--secondary-color)
  );
}

.vh-100 {
  height: 100vh;
  width: 100%;
}

.text-center {
  margin: auto;
  text-align: center;
  width: 50%;
}

.title-login {
  @media (min-width: 500px) {
    font-size: 35px;
  }

  @media (max-width: 500px) {
    font-size: 25px;
  }

  margin-bottom: 25px;
  color: var(--primary-color);
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 35px;
  text-align: center;
}

.botao-entrar {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
}

.no-border {
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.container-imagem-login {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: end;
  align-items: end;
  height: 100vh;
}

.imagem-login {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.imagem-principal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  text-align: start;
  margin-left: 47px;
  margin-top: 5%;
  font-weight: 600 !important;
  font-family: 'DM Sans', sans-serif;
  font-size: 2vw;
  color: white;
  font-family: Arial, sans-serif;
}

.underline {
  text-decoration: underline;
  text-decoration-color: #03fad1;
  text-decoration-thickness: 2px;
}
</style>
