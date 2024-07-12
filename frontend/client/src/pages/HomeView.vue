<template>
  <v-main style="background-color: #f2f2f2; height: 100%">
    <v-row class="container-valor-total">
      <v-col cols="12" md="6">
        <v-card class="valor-total">
          <v-card-text>
            <div>
              <div class="titulo-valor-total">
                R$ {{ this.modelo.totalEntrada }}
              </div>
              <div class="texto-valor-total" style="color: #e57373">
                Entradas
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="2">
        <v-card class="valor-total">
          <v-card-text>
            <div class="titulo-valor-total">
              R$ {{ this.modelo.totalSaida }}
            </div>
            <div class="texto-valor-total" style="color: #00c853">Saídas</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-card class="container-ultimas-movimentacoes">
      <v-card-text>
        <v-card-title>Últimas movimentações</v-card-title>
      </v-card-text>
    </v-card> -->
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store/index';
export default {
  name: 'HomeView',
  data() {
    return {
      modelo: {
        movimentacoes: [],
      },
    };
  },
  methods: {
    obterToken() {
      const authStore = useAuthStore();
      const token = authStore.getToken();

      if (!token) {
        this.$router.push('/login');
      }

      return token;
    },

    async obterValoresTotais() {
      api
        .get(
          `http://localhost:3000/movimentacoes/valor-total-entradas-saidas/`,
          {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          },
        )
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;
        });
    },
    async obterUltimasMovimentacoes() {
      api
        .get(`http://localhost:3000/movimentacoes/ultimas-movimentacoes/`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.modelo.movimentacoes = [];

          const dados = response.data;

          for (const dado of dados) {
            this.modelo.movimentacoes.push(dado);
          }
        });
    },
  },
  created() {
    this.obterValoresTotais();
  },
};
</script>

<style scoped>
.valor-total {
  height: 90px;
  width: 350px;
  border-radius: 15px;
}

.container-valor-total {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.titulo-valor-total {
  color: #aa00ff;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 25px;
  text-align: center;
}
.texto-valor-total {
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  text-align: center;
}

.container-ultimas-movimentacoes {
  border-radius: 15px;
  width: 400px;
  height: 400px;
  margin-top: 15px;
}
</style>
