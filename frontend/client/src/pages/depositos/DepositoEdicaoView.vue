<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Depósitos</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="green" @click="salvar()">
          <v-icon>mdi-check</v-icon>
        </v-btn>

        <v-btn icon color="red" @click="voltar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          label="Descrição"
          v-model="modelo.descricao"
          variant="outlined"
        ></v-text-field>
        <div class="container-endereco">
          <div style="padding: 15px">
            <div style="text-align: left; color: #ce93d8; font-size: large">
              Endereço
            </div>
            <div style="padding: 15px">
              <div class="endereco-campos">
                <v-text-field
                  label="Logradouro"
                  v-model="modelo.endereco.logradouro"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  class="margin-enderecos"
                  label="Bairro"
                  v-model="modelo.endereco.bairro"
                  variant="outlined"
                ></v-text-field>
              </div>

              <div class="endereco-campos">
                <v-text-field
                  label="Número"
                  v-model="modelo.endereco.numero"
                  type="number"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  class="margin-enderecos"
                  label="Lote"
                  type="number"
                  v-model="modelo.endereco.lote"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  class="margin-enderecos"
                  v-mask="'#####-###'"
                  label="CEP"
                  v-model="modelo.endereco.cep"
                  variant="outlined"
                ></v-text-field>
              </div>

              <div class="endereco-campos">
                <v-combobox
                  label="Estado"
                  :items="estados"
                  item-title="nome"
                  item-value="id"
                  v-model="modelo.endereco.estado"
                  variant="outlined"
                  @update:model-value="
                    obterCidades($event);
                    modelo.endereco.municipio = null;
                  "
                ></v-combobox>

                <v-combobox
                  v-if="carregouCidades"
                  class="margin-enderecos"
                  label="Cidade"
                  :items="cidades"
                  item-title="nome"
                  item-value="id"
                  v-model="modelo.endereco.municipio"
                  variant="outlined"
                ></v-combobox>
              </div>
              <v-text-field
                label="Complemento"
                v-model="modelo.endereco.complemento"
                variant="outlined"
              ></v-text-field>
            </div>
          </div>
        </div>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-main>
</template>

<script>
import api from '@/services/api';
import { useAuthStore, useDadosStore, useAlerta } from '@/store/index';
// import MensagensAlerta from '../../components/MensagensAlerta.vue';
export default {
  // components: { MensagensAlerta },
  name: 'DepositosEdicao',
  data() {
    return {
      modelo: {
        descricao: '',
        endereco: {
          logradouro: '',
          bairro: '',
          numero: null,
          lote: null,
          cep: '',
          complemento: '',
          estado: null,
          municipio: null,
        },
      },
      exibeAlerta: false,
      loading: false,
      estados: [],
      cidades: [],
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

    voltar() {
      this.$router.push('/depositos');
    },

    podeGravar() {
      if (!this.modelo.descricao) {
        useAlerta().exibirSnackbar('A descrição é obrigatória!', 'orange');
        return false;
      }

      if (!this.modelo.endereco) {
        useAlerta().exibirSnackbar(
          'O endereço do depósito é obrigatório!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.endereco.logradouro) {
        useAlerta().exibirSnackbar('O logradouro é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.bairro) {
        useAlerta().exibirSnackbar('O bairro é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.cep) {
        useAlerta().exibirSnackbar('O CEP é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.estado) {
        useAlerta().exibirSnackbar('O estado é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.endereco.municipio) {
        useAlerta().exibirSnackbar('A cidade é obrigatória!', 'orange');
        return false;
      }

      return true;
    },

    async salvar() {
      if (!this.podeGravar()) {
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        this.modelo.id = null;
        api
          .patch(
            `http://localhost:3000/depositos/${this.dados.id}`,
            {
              descricao: this.modelo.descricao,
              endereco: this.modelo.endereco,
            },
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
          .then(() => {
            useAlerta().exibirSnackbar(
              'O depósito foi atualizado com sucesso!',
              'green',
            );

            this.voltar();
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              useAlerta().exibirSnackbar(error.response.data.message, 'red');
            } else {
              useAlerta().exibirSnackbar(error.message, 'red');
            }
          });
      } else {
        api
          .post(`http://localhost:3000/depositos/`, this.modelo, {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          })
          .then(() => {
            useAlerta().exibirSnackbar(
              'O depósito foi criado com sucesso!',
              'green',
            );

            this.voltar();
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              useAlerta().exibirSnackbar(error.response.data.message, 'red');
            } else {
              useAlerta().exibirSnackbar(error.message, 'red');
            }
          });
      }
    },

    async obterDepositos() {
      api
        .get(`http://localhost:3000/depositos/${this.dados.id}`, {
          headers: {
            Authorization: `Bearer ${this.obterToken()}`,
          },
        })
        .then((response) => {
          this.modelo = null;

          this.modelo = response.data;

          this.modelo.endereco.estado = this.modelo.endereco.municipio.uf;
          this.obterCidadesPorEstado(this.modelo.endereco.estado);
        });
    },

    async obterEstados(termo = '') {
      api
        .post(
          `http://localhost:3000/estados/obter-parcial`,
          {
            termoDePesquisa: termo,
          },
          {
            headers: {
              Authorization: `Bearer ${this.obterToken()}`,
            },
          },
        )
        .then((response) => {
          this.estados = [];

          this.carregouCidades = false;

          setTimeout(() => {
            this.carregouCidades = true;
          });

          for (const dado of response.data) {
            this.estados.push(dado);
          }
        });
    },

    async obterCidades(estadoSelecionado) {
      if (estadoSelecionado) {
        api
          .post(
            `http://localhost:3000/municipios/obter-parcial`,
            {
              uf: estadoSelecionado.uf,
            },
            {
              headers: {
                Authorization: `Bearer ${this.obterToken()}`,
              },
            },
          )
          .then((response) => {
            this.cidades = [];

            for (const dado of response.data) {
              this.cidades.push(dado);
            }
          });
      }
    },
  },

  created() {
    this.obterEstados();

    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.obterDepositos();
    }
  },
  computed: {
    dados() {
      return useDadosStore().getDadosParaEdicao;
    },
  },
};
</script>

<style scoped>
.container-endereco {
  border-radius: 25px;
  border-style: solid;
  border-width: 2px;
  border-color: #e1bee7;
  max-height: 450px;
  overflow: auto;
}

.endereco-campos {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.margin-enderecos {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}
</style>
