import { formatarNumero, formatarSomenteHorario } from '../utils/formatadores'

const LARGURA = 620
const ALTURA = 210
const ESPACAMENTO = { topo: 18, direita: 18, baixo: 36, esquerda: 46 }

function criarPontos(leituras, campo) {
  const valoresValidos = leituras
    .map((leitura) => leitura[campo])
    .filter((valor) => valor !== null && valor !== undefined)

  if (valoresValidos.length === 0) return { pontos: [], minimo: 0, maximo: 1 }

  const minimoOriginal = Math.min(...valoresValidos)
  const maximoOriginal = Math.max(...valoresValidos)
  const margem = minimoOriginal === maximoOriginal ? Math.max(Math.abs(minimoOriginal) * 0.08, 1) : (maximoOriginal - minimoOriginal) * 0.12
  const minimo = minimoOriginal - margem
  const maximo = maximoOriginal + margem
  const larguraUtil = LARGURA - ESPACAMENTO.esquerda - ESPACAMENTO.direita
  const alturaUtil = ALTURA - ESPACAMENTO.topo - ESPACAMENTO.baixo

  const pontos = leituras.map((leitura, indice) => {
    const valor = leitura[campo]
    if (valor === null || valor === undefined) return null

    const x = ESPACAMENTO.esquerda + (indice / Math.max(leituras.length - 1, 1)) * larguraUtil
    const y = ESPACAMENTO.topo + (1 - (valor - minimo) / (maximo - minimo)) * alturaUtil
    return { x, y, valor, data: leitura.data }
  }).filter(Boolean)

  return { pontos, minimo, maximo }
}

export default function GraficoLinha({ titulo, unidade, leituras, campo, casasDecimais = 1 }) {
  const serieCronologica = [...leituras].reverse()
  const { pontos, minimo, maximo } = criarPontos(serieCronologica, campo)
  const linha = pontos.map((ponto) => `${ponto.x},${ponto.y}`).join(' ')
  const ultimaLeitura = serieCronologica.at(-1)?.[campo]

  return (
    <section className="painel-grafico" aria-labelledby={`grafico-${campo}`}>
      <header className="painel-grafico__cabecalho">
        <div>
          <p className="rotulo-secao">Histórico recente</p>
          <h2 id={`grafico-${campo}`}>{titulo}</h2>
        </div>
        <p className="painel-grafico__ultima-leitura">
          Última: <strong>{formatarNumero(ultimaLeitura, casasDecimais)} {unidade}</strong>
        </p>
      </header>

      {pontos.length > 0 ? (
        <div className="grafico-responsivo">
          <svg viewBox={`0 0 ${LARGURA} ${ALTURA}`} role="img" aria-label={`Gráfico de ${titulo}`}>
            <line x1={ESPACAMENTO.esquerda} y1={ESPACAMENTO.topo} x2={ESPACAMENTO.esquerda} y2={ALTURA - ESPACAMENTO.baixo} className="grafico-eixo" />
            <line x1={ESPACAMENTO.esquerda} y1={ALTURA - ESPACAMENTO.baixo} x2={LARGURA - ESPACAMENTO.direita} y2={ALTURA - ESPACAMENTO.baixo} className="grafico-eixo" />
            <line x1={ESPACAMENTO.esquerda} y1={ESPACAMENTO.topo} x2={LARGURA - ESPACAMENTO.direita} y2={ESPACAMENTO.topo} className="grafico-grade" />
            <line x1={ESPACAMENTO.esquerda} y1={ALTURA / 2} x2={LARGURA - ESPACAMENTO.direita} y2={ALTURA / 2} className="grafico-grade" />
            <line x1={ESPACAMENTO.esquerda} y1={ALTURA - ESPACAMENTO.baixo} x2={LARGURA - ESPACAMENTO.direita} y2={ALTURA - ESPACAMENTO.baixo} className="grafico-grade" />

            <text x="8" y={ESPACAMENTO.topo + 5} className="grafico-texto">{formatarNumero(maximo, casasDecimais)}</text>
            <text x="8" y={ALTURA / 2 + 5} className="grafico-texto">{formatarNumero((maximo + minimo) / 2, casasDecimais)}</text>
            <text x="8" y={ALTURA - ESPACAMENTO.baixo + 5} className="grafico-texto">{formatarNumero(minimo, casasDecimais)}</text>

            <polyline points={linha} className="grafico-linha" />
            {pontos.map((ponto) => (
              <circle key={`${ponto.data}-${ponto.valor}`} cx={ponto.x} cy={ponto.y} r="3.5" className="grafico-ponto">
                <title>{`${formatarSomenteHorario(ponto.data)} — ${formatarNumero(ponto.valor, casasDecimais)} ${unidade}`}</title>
              </circle>
            ))}

            <text x={ESPACAMENTO.esquerda} y={ALTURA - 10} className="grafico-texto">{formatarSomenteHorario(serieCronologica[0]?.data)}</text>
            <text x={LARGURA - ESPACAMENTO.direita - 40} y={ALTURA - 10} className="grafico-texto">{formatarSomenteHorario(serieCronologica.at(-1)?.data)}</text>
          </svg>
        </div>
      ) : (
        <p className="estado-vazio">Ainda não há valores suficientes para desenhar este gráfico.</p>
      )}
    </section>
  )
}
