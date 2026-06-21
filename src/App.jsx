import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import CartaoIndicador from './components/CartaoIndicador'
import GraficoLinha from './components/GraficoLinha'
import TabelaLeituras from './components/TabelaLeituras'
import { CONFIGURACAO_SONDA, INDICADORES } from './config/sonda'
import { supabase } from './lib/supabase'
import { avaliarCondicaoAmbiental } from './utils/avaliarCondicao'
import { exportarLeiturasComoCsv } from './utils/exportarCsv'
import { diferencaEmMinutos, formatarDataHora, normalizarLeitura } from './utils/formatadores'

function obterStatusDaSonda(ultimaLeitura) {
  if (!ultimaLeitura?.data) {
    return { texto: 'Sem dados', classe: 'status--sem-dados' }
  }

  const minutosSemAtualizacao = diferencaEmMinutos(ultimaLeitura.data)

  if (minutosSemAtualizacao <= 5) {
    return { texto: 'Online', classe: 'status--online' }
  }

  return { texto: 'Sem atualização recente', classe: 'status--atencao' }
}

function montarConsultaDeLeituras() {
  const { tabelaLeituras, campos, identificadorSonda, quantidadeDeLeituras } = CONFIGURACAO_SONDA

  let consulta = supabase
    .from(tabelaLeituras)
    .select('*')
    .order(campos.data, { ascending: false })
    .limit(quantidadeDeLeituras)

  if (identificadorSonda) {
    consulta = consulta.eq(campos.sonda, identificadorSonda)
  }

  return consulta
}

export default function App() {
  const [leituras, setLeituras] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null)

  const carregarLeituras = useCallback(async () => {
    if (!supabase) {
      setErro('Por enquanto sem dados supabase')
      setCarregando(false)
      return
    }

    setErro('')
    const { data, error } = await montarConsultaDeLeituras()

    if (error) {
      setErro(`Não foi possível carregar as leituras: ${error.message}`)
      setCarregando(false)
      return
    }

    setLeituras((data ?? []).map(normalizarLeitura))
    setUltimaAtualizacao(new Date())
    setCarregando(false)
  }, [])

  useEffect(() => {
    carregarLeituras()

    const intervalo = window.setInterval(carregarLeituras, CONFIGURACAO_SONDA.intervaloDeAtualizacaoMs)

    if (!supabase) {
      return () => window.clearInterval(intervalo)
    }

    const canal = supabase
      .channel('atualizacao-de-leituras')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: CONFIGURACAO_SONDA.tabelaLeituras,
        },
        (evento) => {
          const novaLeitura = normalizarLeitura(evento.new)

          if (
            CONFIGURACAO_SONDA.identificadorSonda
            && novaLeitura.sonda !== CONFIGURACAO_SONDA.identificadorSonda
          ) {
            return
          }

          setLeituras((leiturasAtuais) => {
            const atualizadas = [novaLeitura, ...leiturasAtuais.filter((item) => item.id !== novaLeitura.id)]
            return atualizadas.slice(0, CONFIGURACAO_SONDA.quantidadeDeLeituras)
          })
          setUltimaAtualizacao(new Date())
        },
      )
      .subscribe()

    return () => {
      window.clearInterval(intervalo)
      supabase.removeChannel(canal)
    }
  }, [carregarLeituras])

  const ultimaLeitura = leituras[0]
  const statusDaSonda = obterStatusDaSonda(ultimaLeitura)
  const condicaoAmbiental = useMemo(() => avaliarCondicaoAmbiental(ultimaLeitura), [ultimaLeitura])

  return (
    <main className="aplicacao">
      <header className="cabecalho-principal">
        <div>
          <p className="marca">LABORATÓRIO DE FICOLOGIA</p>
          <h1>Monitoramento ambiental</h1>
          <p className="cabecalho-principal__descricao">
            Acompanhamento de dados da sonda multiparamétrica de baixo custo.
          </p>
        </div>

        <div className="cabecalho-principal__acoes">
          <div className={`status-sonda ${statusDaSonda.classe}`}>
            <span aria-hidden="true" />
            {statusDaSonda.texto}
          </div>
          <button className="botao botao--secundario" onClick={carregarLeituras} type="button">
            Atualizar dados
          </button>
        </div>
      </header>

      {erro && (
        <section className="mensagem-erro" role="alert">
          <strong>Verifique a conexão com o banco.</strong>
          <span>{erro}</span>
        </section>
      )}

      <section className="painel-resumo" aria-label="Resumo da última leitura">
        <div>
          <p className="rotulo-secao">Última transmissão</p>
          <h2>{ultimaLeitura ? formatarDataHora(ultimaLeitura.data) : 'Aguardando conexão'}</h2>
          <p>
            {ultimaLeitura
              ? `Sonda: ${ultimaLeitura.sonda}`
              : 'Os indicadores aparecerão assim que a primeira leitura for salva no banco.'}
          </p>
        </div>

        <div>
          <p className="rotulo-secao">Atualização do painel</p>
          <h2>{ultimaAtualizacao ? formatarDataHora(ultimaAtualizacao) : '—'}</h2>
          <p>Atualização automática a cada 30 segundos.</p>
        </div>
      </section>

      <section className="grade-indicadores" aria-label="Indicadores da última leitura">
        {INDICADORES.map((indicador) => (
          <CartaoIndicador
            key={indicador.chave}
            indicador={indicador}
            valor={ultimaLeitura?.[indicador.chave]}
          />
        ))}
      </section>

      <section className={`cartao-condicao cartao-condicao--${condicaoAmbiental.nivel}`} aria-labelledby="titulo-condicao">
        <div>
          <p className="rotulo-secao">Interpretação preliminar</p>
          <h2 id="titulo-condicao">{condicaoAmbiental.titulo}</h2>
          <p>{condicaoAmbiental.descricao}</p>
        </div>
        <ul>
          {condicaoAmbiental.sinais.map((sinal) => <li key={sinal}>{sinal}</li>)}
        </ul>
      </section>

      <section className="grade-graficos" aria-label="Gráficos das leituras recentes">
        <GraficoLinha titulo="Temperatura" unidade="°C" leituras={leituras} campo="temperatura" casasDecimais={1} />
        <GraficoLinha titulo="pH estimado" unidade="" leituras={leituras} campo="ph" casasDecimais={2} />
      </section>

      <TabelaLeituras leituras={leituras} />

      <footer className="rodape-principal">
        <p>
          Leituras de baixo custo devem ser interpretadas com calibração, validação e contexto ambiental.
        </p>
        <button
          className="botao botao--texto"
          type="button"
          disabled={leituras.length === 0}
          onClick={() => exportarLeiturasComoCsv(leituras)}
        >
          Exportar leituras em CSV
        </button>
      </footer>

      {carregando && (
        <div className="camada-carregamento" role="status" aria-live="polite">
          Carregando dados da sonda...
        </div>
      )}
    </main>
  )
}
