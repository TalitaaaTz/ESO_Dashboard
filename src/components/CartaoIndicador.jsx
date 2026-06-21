import { formatarNumero } from '../utils/formatadores'

export default function CartaoIndicador({ indicador, valor }) {
  return (
    <article className="cartao-indicador">
      <header className="cartao-indicador__cabecalho">
        <h2>{indicador.titulo}</h2>
        <span className="cartao-indicador__ponto" aria-hidden="true" />
      </header>

      <p className="cartao-indicador__valor">
        {formatarNumero(valor, indicador.casasDecimais)}
        {indicador.unidade && <span>{indicador.unidade}</span>}
      </p>

      <p className="cartao-indicador__descricao">{indicador.descricao}</p>
    </article>
  )
}
