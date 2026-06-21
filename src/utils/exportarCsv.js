import { INDICADORES } from '../config/sonda'
import { formatarDataHora } from './formatadores'

export function exportarLeiturasComoCsv(leituras) {
  const cabecalho = ['Data e hora', 'Sonda', ...INDICADORES.map((item) => `${item.titulo} (${item.unidade || 'valor'})`)]

  const linhas = leituras.map((leitura) => [
    formatarDataHora(leitura.data),
    leitura.sonda,
    ...INDICADORES.map((item) => leitura[item.chave] ?? ''),
  ])

  const csv = [cabecalho, ...linhas]
    .map((linha) => linha.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(';'))
    .join('\n')

  const arquivo = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(arquivo)
  const link = document.createElement('a')

  link.href = url
  link.download = `leituras-sonda-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
