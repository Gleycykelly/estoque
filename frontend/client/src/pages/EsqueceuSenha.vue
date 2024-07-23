<template>
  <v-app>
    <v-main class="cadastro">
      <v-card rounded="lg" class="card-cadastro">
        <div v-if="cardAtual === 1">
          <v-card-title class="titulo-cadastro">
            Esqueci minha senha
          </v-card-title>

          <v-card-text class="input-card">
            <span class="subtitulo-esqueceu-senha">
              Para sua segurança enviaremos um código para validar sua
              redefinição de senha
            </span>
            <span></span>
            <v-text-field
              flat
              solo
              v-model="dadosUsuario.email"
              :rules="[(v) => !!v || 'O e-mail é obrigatório!']"
              label="E-mail"
              required
              rounded="lg"
              placeholder="Digite seu e-mail"
              variant="outlined"
            ></v-text-field>
          </v-card-text>
        </div>

        <v-card-actions class="acoes">
          <v-btn
            class="botao-redefinir-senha"
            variant="elevated"
            rounded="lg"
            type="submit"
            block
          >
            Redefinir senha
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'cadastro-view',
  data() {
    return {
      dadosUsuario: {
        nome: '',
        email: '',
        senha: '',
      },
      cardAtual: 1,
    };
  },
  methods: {
    obterCardAtual(acao) {
      if (acao === 'proximo') {
        this.cardAtual++;
      }

      if (acao === 'anterior') {
        this.cardAtual--;
      }
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

.cadastro {
  background-color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-cadastro {
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: #f2f2f2;
  width: 600px;
  height: 600px;
}

.titulo-cadastro {
  color: var(--primary-color);
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 30px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 60px;
}

.acoes {
  padding: 50px;
  align-self: end !important;
  display: flex;
  justify-content: space-between;
  font-weight: bolder;
  font-family: 'Roboto', sans-serif !important;
}

.botao-redefinir-senha {
  background-color: var(--primary-color);
  color: white !important;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
}

.input-card {
  padding: 50px;
}

.subtitulo-esqueceu-senha {
  font-size: 15px;
  color: rgb(156, 151, 151);
}
</style>
