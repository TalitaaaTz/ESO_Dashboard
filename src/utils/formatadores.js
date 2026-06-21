import { CONFIGURACAO_SONDA } from '../config/sonda'

export function converterParaNumero(valor) {
  if (valor === null || valor === undefined || valor === '') return null

  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : null
}

export function formatarNumero(valor, casasDecimais = 1) {
  const numero = converterParaNumero(valor)
  if (numero === null) return '—'

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: casasDecimais,
  }).format(numero)
}

export function formatarDataHora(dataIso) {
  if (!dataIso) return 'Sem registro'

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(dataIso))
}

export function formatarSomenteHorario(dataIso) {
  if (!dataIso) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dataIso))
}

export function normalizarLeitura(registro) {
  const { campos } = CONFIGURACAO_SONDA

  return {
    id: registro[campos.id] ?? crypto.randomUUID(),
    data: registro[campos.data],
    sonda: 'SONDA-01',
    temperatura: converterParaNumero(registro[campos.temperatura]),
    ph: converterParaNumero(registro[campos.ph]),
    condutividade: converterParaNumero(registro[campos.condutividade]),
    tds: converterParaNumero(registro[campos.tds]),
    tensaoPh: converterParaNumero(registro[campos.tensaoPh]),
  }
}

export function diferencaEmMinutos(dataIso) {
  if (!dataIso) return Number.POSITIVE_INFINITY

  const diferenca = Date.now() - new Date(dataIso).getTime()
  return Math.max(0, diferenca / 60000)
}