<template>
  <v-main class="fill-height">
    <v-card min-height="90vh" width="calc(100% - 100px)" style="margin: 0 auto">
      <v-toolbar flat>
        <v-toolbar-title class="text-grey">Operadores</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon color="green" @click="salvar()">
          <v-icon>mdi-check</v-icon>
          <v-tooltip activator="parent" location="top">Salvar</v-tooltip>
        </v-btn>

        <v-btn icon color="red" @click="voltar()">
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="top">Voltar</v-tooltip>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-tabs
          v-model="tab"
          align-tabs="center"
          color="var(--primary-color)"
          style="margin-bottom: 25px"
        >
          <v-tab :value="1">Geral</v-tab>
          <v-tab :value="2">Endereços</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="1" :value="1">
            <div class="dados-gerais">
              <v-alert
                v-if="!ehAtualizacao"
                style="margin-bottom: 20px"
                prominent
                variant="outlined"
                title="Nova senha"
                type="warning"
              >
                <div style="text-align: left; font-size: 16px">
                  A senha inicial do novo usuário é o CPF dele, certifique-se de
                  avisar para que o usuário troque a senha imediatamente na aba
                  'Perfil' ao acessar pela primeira vez o sistema!
                </div>
              </v-alert>
              <v-text-field
                label="Nome"
                v-model="modelo.nome"
                maxlength="150"
                variant="outlined"
              >
                <template #label>
                  Nome
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>

              <v-text-field
                label="E-mail"
                v-model="modelo.email"
                maxlength="100"
                variant="outlined"
              >
                <template #label>
                  E-mail
                  <span><strong>*</strong></span>
                </template>
              </v-text-field>

              <div class="dados-gerais-campos">
                <v-text-field
                  label="CPF"
                  v-mask="'###.###.###-##'"
                  v-model="modelo.cpf"
                  variant="outlined"
                >
                  <template #label>
                    CPF
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>

                <v-text-field
                  class="dados-gerais-margin"
                  label="RG"
                  v-mask="'##.###.###-#'"
                  v-model="modelo.rg"
                  variant="outlined"
                >
                  <template #label>
                    RG
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>
              </div>
              <div class="dados-gerais-campos">
                <v-text-field
                  class="campo-data-aniversario"
                  variant="outlined"
                  type="date"
                  v-model="modelo.dataNascimento"
                  clearable
                >
                  <template #label>
                    Data de nascimento
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>

                <v-combobox
                  class="dados-gerais-margin"
                  label="Genêros"
                  :items="['Feminino', 'Masculino']"
                  item-title="descricao"
                  item-value="id"
                  v-model="modelo.generoUsuario"
                  variant="outlined"
                >
                  <template #label>
                    Genêros
                    <span><strong>*</strong></span>
                  </template>
                </v-combobox>

                <v-combobox
                  class="dados-gerais-margin"
                  label="Permissão"
                  :items="['Administrador', 'Usuario']"
                  item-title="descricao"
                  item-value="id"
                  v-model="modelo.permissaoUsuario"
                  variant="outlined"
                  @update:model-value="modelo.depositos = []"
                >
                  <template #label>
                    Permissão
                    <span><strong>*</strong></span>
                  </template>
                </v-combobox>
              </div>
              <v-select
                :disabled="
                  modelo.permissaoUsuario &&
                  modelo.permissaoUsuario === 'Administrador'
                "
                return-object
                v-model="modelo.depositos"
                item-title="descricao"
                item-value="id"
                :items="depositos"
                label="Depósitos visiveis"
                multiple
                color="var(--primary-color)"
                variant="outlined"
                persistent-hint
              ></v-select>
              <div class="dados-gerais-campos">
                <v-text-field
                  label="Telefone principal"
                  v-mask="'(##) #####-####'"
                  v-model="modelo.usuariosTelefones.telefonePrincipal"
                  variant="outlined"
                >
                  <template #label>
                    Telefone principal
                    <span><strong>*</strong></span>
                  </template>
                </v-text-field>

                <v-text-field
                  class="dados-gerais-margin"
                  label="Telefone secundário"
                  v-mask="'(##) #####-####'"
                  v-model="modelo.usuariosTelefones.telefone"
                  variant="outlined"
                ></v-text-field>
              </div>
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item :key="2" :value="2">
            <div class="text-start">
              <v-card-title>
                <v-dialog v-model="dialog" class="card-novo-endereco">
                  <template #activator="{ props }">
                    <v-btn
                      class="botao-novo-endereco"
                      prepend-icon="mdi-plus"
                      v-bind="props"
                      variant="tonal"
                    >
                      Adicionar
                    </v-btn>
                  </template>
                  <v-card title="Novo endereço">
                    <v-card-text>
                      <div>
                        <v-text-field
                          label="Logradouro"
                          v-model="novoEndereco.logradouro"
                          maxlength="100"
                          variant="outlined"
                        >
                          <template #label>
                            Logradouro
                            <span><strong>*</strong></span>
                          </template>
                        </v-text-field>
                        <v-text-field
                          label="Bairro"
                          v-model="novoEndereco.bairro"
                          maxlength="100"
                          variant="outlined"
                        >
                          <template #label>
                            Bairro
                            <span><strong>*</strong></span>
                          </template>
                        </v-text-field>
                      </div>

                      <div>
                        <v-text-field
                          label="Número"
                          v-model="novoEndereco.numero"
                          type="number"
                          variant="outlined"
                        ></v-text-field>
                        <v-text-field
                          label="Lote"
                          type="number"
                          v-model="novoEndereco.lote"
                          variant="outlined"
                        ></v-text-field>

                        <v-text-field
                          v-mask="'#####-###'"
                          label="CEP"
                          v-model="novoEndereco.cep"
                          variant="outlined"
                        >
                          <template #label>
                            CEP
                            <span><strong>*</strong></span>
                          </template>
                        </v-text-field>
                      </div>

                      <div>
                        <v-combobox
                          label="Estado"
                          :items="estados"
                          item-title="nome"
                          item-value="id"
                          v-model="novoEndereco.estado"
                          variant="outlined"
                          @update:model-value="
                            obterCidades($event);
                            novoEndereco.municipio = null;
                          "
                        >
                          <template #label>
                            Estado
                            <span><strong>*</strong></span>
                          </template>
                        </v-combobox>

                        <v-combobox
                          v-if="carregouCidades"
                          label="Cidade"
                          :items="cidades"
                          item-title="nome"
                          item-value="id"
                          v-model="novoEndereco.municipio"
                          variant="outlined"
                        >
                          <template #label>
                            Cidade
                            <span><strong>*</strong></span>
                          </template>
                        </v-combobox>
                      </div>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text="voltar"
                        variant="plain"
                        @click="sairDoModalNovoEndereco()"
                      ></v-btn>

                      <v-btn
                        color="var(--primary-color)"
                        text="Adicionar"
                        variant="tonal"
                        @click="adicionarNovoEndereco()"
                      ></v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-title>
            </div>
            <div class="container-endereco">
              <div v-for="endereco in modelo.enderecos" :key="endereco.id">
                <div class="container-dados-endereco">
                  <v-text-field
                    label="Logradouro"
                    v-model="endereco.logradouro"
                    variant="outlined"
                  >
                    <template #label>
                      Logradouro
                      <span><strong>*</strong></span>
                    </template>
                  </v-text-field>
                  <v-text-field
                    class="campos-endereco"
                    label="Bairro"
                    v-model="endereco.bairro"
                    variant="outlined"
                  >
                    <template #label>
                      Bairro
                      <span><strong>*</strong></span>
                    </template>
                  </v-text-field>
                </div>

                <div class="container-dados-endereco">
                  <v-text-field
                    label="Número"
                    v-model="endereco.numero"
                    type="number"
                    variant="outlined"
                  ></v-text-field>
                  <v-text-field
                    class="campos-endereco"
                    label="Lote"
                    type="number"
                    v-model="endereco.lote"
                    variant="outlined"
                  ></v-text-field>

                  <v-text-field
                    class="campos-endereco"
                    v-mask="'#####-###'"
                    label="CEP"
                    v-model="endereco.cep"
                    variant="outlined"
                  >
                    <template #label>
                      CEP
                      <span><strong>*</strong></span>
                    </template>
                  </v-text-field>
                </div>

                <div class="container-dados-endereco">
                  <v-combobox
                    label="Estado"
                    :items="estados"
                    item-title="nome"
                    item-value="id"
                    v-model="endereco.estado"
                    variant="outlined"
                    @update:model-value="
                      obterCidades($event);
                      endereco.municipio = null;
                    "
                  >
                    <template #label>
                      Estado
                      <span><strong>*</strong></span>
                    </template>
                  </v-combobox>

                  <v-combobox
                    v-if="carregouCidades"
                    class="campos-endereco"
                    label="Cidade"
                    :items="cidades"
                    item-title="nome"
                    item-value="id"
                    v-model="endereco.municipio"
                    variant="outlined"
                  >
                    <template #label>
                      Cidade
                      <span><strong>*</strong></span>
                    </template>
                  </v-combobox>
                </div>
                <v-divider
                  style="
                    border-color: var(--primary-color);
                    border-width: 1px;
                    border-style: dashed;
                    margin-bottom: 25px;
                  "
                ></v-divider>
              </div>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import comunicacaoUsuarios from '@/services/usuarios/comunicacao-usuarios';
import comunicacaoDepositos from '@/services/depositos/comunicacao-deposito';
import { useDadosStore, useAlerta } from '@/store/index';
import comunicacaoEstados from '@/services/estados/comunicacao-estados';
import comunicacaoMunicipios from '@/services/municipios/comunicacao-municipios';
export default {
  name: 'OperadoresEdicao',
  data() {
    return {
      carregouCidades: false,
      ehAtualizacao: false,
      modelo: {
        depositos: [],
        enderecos: [],
        usuariosTelefones: {},
      },
      dialog: false,
      novoEndereco: {},
      tab: 0,
      estados: [],
      cidades: [],
    };
  },
  methods: {
    voltar() {
      this.$router.push('/operadores');
    },

    podeGravar() {
      if (!this.modelo.nome) {
        useAlerta().exibirSnackbar('O nome é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.email) {
        useAlerta().exibirSnackbar('O e-mail é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.cpf) {
        useAlerta().exibirSnackbar('O CPF é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.rg) {
        useAlerta().exibirSnackbar('O RG é obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.dataNascimento) {
        useAlerta().exibirSnackbar(
          'A data de nascimento é obrigatória!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.generoUsuario) {
        useAlerta().exibirSnackbar('O genêro obrigatório!', 'orange');
        return false;
      }

      if (!this.modelo.permissaoUsuario) {
        useAlerta().exibirSnackbar(
          'Selecione qual o tipo de permissão do operador!',
          'orange',
        );
        return false;
      }

      if (!this.modelo.usuariosTelefones.telefonePrincipal) {
        useAlerta().exibirSnackbar('O telefone é obrigatório!', 'orange');
        return false;
      }

      if (this.modelo.enderecos == null || this.modelo.enderecos.length <= 0) {
        useAlerta().exibirSnackbar(
          'Informe pelo menos um endereço para o operador!',
          'orange',
        );
        return false;
      }

      for (const endereco of this.modelo.enderecos) {
        if (!endereco.logradouro) {
          useAlerta().exibirSnackbar(
            'O logradouro é obrigatório, verifique se os endereços estão preenchidos corretamente!',
            'orange',
          );
          return false;
        }

        if (!endereco.bairro) {
          useAlerta().exibirSnackbar(
            'O bairro é obrigatório verifique se os endereços estão preenchidos corretamente!',
            'orange',
          );
          return false;
        }

        if (!endereco.cep) {
          useAlerta().exibirSnackbar(
            'O CEP é obrigatório verifique se os endereços estão preenchidos corretamente!',
            'orange',
          );
          return false;
        }

        if (!endereco.estado || !endereco.estado.id) {
          useAlerta().exibirSnackbar(
            'O estado é obrigatório, verifique se os endereços estão preenchidos corretamente!',
            'orange',
          );
          return false;
        }

        if (!endereco.municipio || !endereco.municipio.id) {
          useAlerta().exibirSnackbar(
            'A cidade é obrigatória,  verifique se os endereços estão preenchidos corretamente!',
            'orange',
          );
          return false;
        }
      }
      return true;
    },

    async salvar() {
      if (!this.podeGravar()) {
        return;
      }

      if (this.dados && this.dados.ehTelaAtualizacao) {
        await comunicacaoUsuarios
          .atualizar(this.dados.id, this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'O operador foi atualizado com sucesso!',
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
        await comunicacaoUsuarios
          .criar(this.modelo)
          .then(() => {
            useAlerta().exibirSnackbar(
              'O operador foi criado com sucesso',
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

    async obterOperadores() {
      await comunicacaoUsuarios.obterPorId(this.dados.id).then((response) => {
        this.modelo = null;
        this.modelo = response.data;

        if (!this.modelo.usuariosTelefones) this.modelo.usuariosTelefones = {};

        for (const endereco of this.modelo.enderecos) {
          endereco.estado = endereco.municipio.uf;
        }
      });
    },

    async obterDepositos() {
      comunicacaoDepositos.obterParcialFiltro().then((response) => {
        this.depositos = [];

        for (const deposito of response.data) {
          this.depositos.push(deposito);
        }
      });
    },

    async obterEstados(termo = '') {
      comunicacaoEstados
        .obterParcialFiltro({
          termoDePesquisa: termo,
        })
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
      comunicacaoMunicipios
        .obterParcialFiltro({
          uf: estadoSelecionado.uf,
        })
        .then((response) => {
          this.cidades = [];

          for (const dado of response.data) {
            this.cidades.push(dado);
          }
        });
    },

    sairDoModalNovoEndereco() {
      this.dialog = false;
    },

    adicionarNovoEndereco() {
      this.dialog = false;
      this.modelo.enderecos.push(this.novoEndereco);
      this.novoEndereco = {};
    },
  },
  created() {
    this.obterEstados();
    this.obterDepositos();
    if (this.dados && this.dados.ehTelaAtualizacao) {
      this.ehAtualizacao = true;
      this.obterOperadores();
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
  padding: 15px;
  max-height: 70vh;
  overflow: auto !important;
}

.container-dados-endereco {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.campos-endereco {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}

.botao-novo-endereco {
  background-color: var(--primary-color) !important;
  color: white !important;
  font-weight: 900 !important;
  font-family: 'Roboto', sans-serif;
  margin-bottom: 15px;
}

.card-novo-endereco {
  @media (min-width: 850px) {
    width: 600px;
  }

  @media (max-width: 849px) {
    width: 100%;
  }
}

.dados-gerais {
  padding: 15px;
  max-height: 70vh;
  overflow: auto;
}

.dados-gerais-margin {
  @media (min-width: 850px) {
    margin-left: 15px;
  }

  @media (max-width: 849px) {
    margin-left: 0;
  }
}

.dados-gerais-campos {
  @media (min-width: 850px) {
    display: flex;
  }

  @media (max-width: 849px) {
    display: block;
  }
}

.campo-data-aniversario {
  @media (min-width: 850px) {
    width: 180px;
  }

  @media (max-width: 849px) {
  }
}
</style>
