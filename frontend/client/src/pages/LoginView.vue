<template style="max-width: 1200px">
  <v-row class="vh-100">
    <v-col
      cols="12"
      md="5"
      class="d-flex justify-content-center align-items-center left-login"
    >
      <div class="text-center">
        <h2 class="title-login">Login</h2>
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
      <div></div>
    </v-col>
  </v-row>
</template>

<script>
import api from '@/services/api';
import { useAuthStore, useAlerta } from '@/store/index';

export default {
  name: 'login-view',
  data() {
    return {
      form: {
        email: '',
        senha: '',
      },
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

      api
        .post(`http://localhost:3000/autenticacao/entrar/`, {
          email: this.form.email,
          senha: this.form.senha,
        })
        .then((response) => {
          const token = response.data;
          const authStore = useAuthStore();
          authStore.setToken(token);
          console.log('realizou login');
          this.$router.push('/home');
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

<style>
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
  background-color: #aa00ff;
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
  color: #aa00ff;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 45px;
  text-align: center;
}

.botao-entrar {
  background-color: #aa00ff !important;
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
</style>
