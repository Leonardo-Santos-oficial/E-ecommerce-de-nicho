export default function AdditionalServices() {
  return (
    <section aria-labelledby="servicos-adicionais" className="card p-4">
      <h2 id="servicos-adicionais" className="text-lg font-semibold mb-3">
        Serviços adicionais
      </h2>
      <div className="flex items-start gap-3">
        <input id="garantia" type="checkbox" className="mt-1" disabled />
        <label htmlFor="garantia" className="text-sm text-white">
          Garantia estendida (em breve)
          <div className="text-xs text-white">
            Proteja seu produto por mais tempo com assistência especializada.
          </div>
        </label>
      </div>
    </section>
  )
}
