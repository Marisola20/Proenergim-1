// Estructura compartida por las páginas legales, para que política y términos
// se vean y se mantengan igual.

export function PaginaLegal({ titulo, resumen, actualizado, children }) {
  return (
    <main className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-dark)] mb-3">
        {titulo}
      </h1>

      {resumen && (
        <p className="text-base text-[var(--color-text)] leading-relaxed mb-4">
          {resumen}
        </p>
      )}

      <p className="text-sm text-[var(--color-text-muted)] mb-10 pb-6 border-b border-slate-200">
        Última actualización: {actualizado}
      </p>

      <div className="space-y-9">{children}</div>
    </main>
  )
}

export function Seccion({ titulo, children }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-primary-dark)] mb-3">
        {titulo}
      </h2>
      <div className="space-y-3 text-[var(--color-text-muted)] leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export function Lista({ items }) {
  return (
    <ul className="space-y-2 pl-5 list-disc marker:text-[var(--color-primary)]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
