/**
 * ÚNICO ARQUIVO QUE NORMALMENTE PRECISA SER AJUSTADO
 * para encaixar o dashboard no banco que vocês já criaram.
 */
export const CONFIGURACAO_SONDA = {
  tabelaLeituras: 'sensor_readings',
  identificadorSonda: null,
  quantidadeDeLeituras: 60,
  intervaloDeAtualizacaoMs: 10000,

  campos: {
    id: 'id',
    data: 'created_at',
    temperatura: 'temperature',
    ph: 'ph_estimate',
    condutividade: 'ec',
    tds: 'tds',
    tensaoPh: 'ph_voltage',
  },

  faixasDeObservacao: {
    temperatura: { minimo: 18, maximo: 32 },
    ph: { minimo: 5.5, maximo: 8.5 },
    condutividade: { minimo: 0, maximo: 1500 },
    tds: { minimo: 0, maximo: 800 },
    tensaoPh: { minimo: 0, maximo: 5 },
  },
}

export const INDICADORES = [
  {
    chave: 'temperatura',
    titulo: 'Temperatura',
    unidade: '°C',
    casasDecimais: 1,
    descricao: 'Leitura do sensor DS18B20',
  },
  {
    chave: 'ph',
    titulo: 'pH estimado',
    unidade: '',
    casasDecimais: 2,
    descricao: 'Valor provisório do PH4502C via ADS1115',
  },
  {
    chave: 'condutividade',
    titulo: 'Condutividade',
    unidade: 'µS/cm',
    casasDecimais: 0,
    descricao: 'Condutividade elétrica estimada',
  },
  {
    chave: 'tds',
    titulo: 'TDS',
    unidade: 'ppm',
    casasDecimais: 1,
    descricao: 'Sólidos dissolvidos totais',
  },
  {
    chave: 'tensaoPh',
    titulo: 'Tensão pH',
    unidade: 'V',
    casasDecimais: 4,
    descricao: 'Tensão lida no ADS1115 A0',
  },
]