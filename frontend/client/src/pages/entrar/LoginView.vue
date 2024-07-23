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
          <div class="esqueceu-senha">
            <span class="texto-esqueceu-senha" @click="esqueceuSenha">
              Esqueceu a senha?
            </span>
          </div>
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
    <v-col md="7" class="d-none d-sm-none d-md-block rigth-login">
      <div>
        <div class="imagem-principal">
          <img :src="imagemURL" alt="Logo" class="logo" />
        </div>
        <div class="frase-principal">
          <div style="max-width: 295px">
            Seu estoque sob controle, seu negócio em alta.
            <v-icon style="font-size: 27px">mdi-rocket-launch-outline</v-icon>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { login } from '@/services/autenticacao/comunicacao-autenticacao';
import { useAuthStore, useAlerta } from '@/store/index';
import logo from '@/assets/esstoqueCompleto.jpeg';

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

.row-login {
  margin-left: 0;
}

.left-login {
  background-color: #f2f2f2;
}

.rigth-login {
  background-color: var(--primary-color);
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

.esqueceu-senha {
  margin-bottom: 15px;
  text-align: end;
  color: #a09f9f;
  cursor: pointer;
}

.novo-cadastro {
  margin-top: 40px;
}

.texto-novo-cadastro {
  color: #a09f9f;
}

.link-cadastro {
  margin-left: 5px;
}

.logo {
  max-width: 450px;
  height: auto;
  border: solid 25px transparent;
  border-top-color: var(--primary-color);
  border-left-color: var(--primary-color);
  border-radius: 8%;
}

.imagem-principal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.frase-principal {
  font-weight: 600 !important;
  font-family: 'DM Sans', sans-serif;
  font-size: 27px;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  color: white;
}
</style>
