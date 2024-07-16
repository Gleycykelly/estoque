import comunicacaoAbstrata from '../comunicacao-abstrata';

const caminho = 'usuarios';
const comunicacaoUsuarios = comunicacaoAbstrata(caminho);

const obterUsuarioLogado = () => {
  return comunicacaoUsuarios.instancia.get(`/usuarios/obter-usuario-logado`);
};

export default { ...comunicacaoUsuarios, obterUsuarioLogado };
