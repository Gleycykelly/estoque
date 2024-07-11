<template>
  <div class="text-center ma-2">
    <v-snackbar
      style="justify-content: right; z-index: 1; align-items: flex-start"
      v-model="show"
      :color="color"
      multi-line
      @update:model-value="exibirMensagem()"
    >
      <div style="color: white; font-size: 17px">
        {{ text }}
      </div>

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="fechar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { useAlerta } from '@/store/index';
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Alertas',
  data() {
    return {
      timeout: 500,
    };
  },
  computed: {
    show() {
      return useAlerta().show;
    },
    text() {
      return useAlerta().text;
    },
    color() {
      return useAlerta().color;
    },
  },
  methods: {
    exibirMensagem() {
      setTimeout(() => {
        this.fechar();
      }, this.timeout);
    },
    fechar() {
      const store = useAlerta();
      store.fechar();
    },
  },
};
</script>

<style></style>
