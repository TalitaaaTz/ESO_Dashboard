import { CONFIGURACAO_SONDA, INDICADORES } from '../config/sonda'

function estaForaDaFaixa(valor, faixa) {
  if (valor === null || valor === undefined) return false
  return valor < faixa.minimo || valor > faixa.maximo
}

export function avaliarCondicaoAmbiental(leitura) {
  if (!leitura) {
    return {
      nivel: 'sem-dados',
      titulo: 'Aguardando leituras',
      descricao: 'O painel exibirá uma interpretação preliminar assim que receber dados da sonda.',
      sinais: [],
    }
  }

  const sinais = INDICADORES
    .filter((indicador) => {
      const faixa = CONFIGURACAO_SONDA.faixasDeObservacao[indicador.chave]
      return estaForaDaFaixa(leitura[indicador.chave], faixa)
    })
    .map((indicador) => `${indicador.titulo} fora da faixa configurada`)

  if (sinais.length === 0) {
    return {
      nivel: 'regular',
      titulo: 'Em observação',
      descricao: 'A última leitura está dentro das faixas configuradas para acompanhamento.',
      sinais: ['Nenhum desvio identificado na última leitura'],
    }
  }

  if (sinais.length === 1) {
    return {
      nivel: 'atencao',
      titulo: 'Atenção necessária',
      descricao: 'Foi identificado um parâmetro fora da faixa de observação configurada.',
      sinais,
    }
  }

  return {
    nivel: 'prioridade',
    titulo: 'Prioridade de avaliação',
    descricao: 'Mais de um parâmetro está fora da faixa configurada. Recomenda-se verificar a sonda e o ambiente monitorado.',
    sinais,
  }
}
