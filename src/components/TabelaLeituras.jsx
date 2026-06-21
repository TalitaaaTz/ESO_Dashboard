import { INDICADORES } from '../config/sonda'
import { formatarDataHora, formatarNumero } from '../utils/formatadores'

export default function TabelaLeituras({ leituras }) {
  return (
    <section className="tabela-leituras" aria-labelledby="titulo-tabela">
      <header className="tabela-leituras__cabecalho">
        <div>
          <p className="rotulo-secao">Banco de dados</p>
          <h2 id="titulo-tabela">Últimas leituras recebidas</h2>
        </div>
        <p>{leituras.length} registros exibidos</p>
      </header>

      <div className="tabela-leituras__rolagem">
        <table>
          <thead>
            <tr>
              <th>Data e hora</th>
              {INDICADORES.map((indicador) => (
                <th key={indicador.chave}>{indicador.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leituras.slice(0, 10).map((leitura) => (
              <tr key={leitura.id}>
                <td>{formatarDataHora(leitura.data)}</td>
                {INDICADORES.map((indicador) => (
                  <td key={indicador.chave}>
                    {formatarNumero(leitura[indicador.chave], indicador.casasDecimais)} {indicador.unidade}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
