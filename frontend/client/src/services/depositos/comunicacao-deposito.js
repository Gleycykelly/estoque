import comunicacaoAbstrata from '../comunicacao-abstrata';

const caminho = 'depositos';
const comunicacaoDepositos = comunicacaoAbstrata(caminho);

const obterQuantidadeDeDepositosVisiveis = () => {
  return comunicacaoDepositos.instancia.get(
    `/depositos/obter-quantidade-de-depositos-visiveis/`,
  );
};

export default { ...comunicacaoDepositos, obterQuantidadeDeDepositosVisiveis };
