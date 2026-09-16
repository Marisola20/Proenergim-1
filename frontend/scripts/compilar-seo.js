// ─────────────────────────────────────────────────────────────────────────────
//  Compilador de SEO
//
//  Genera, a partir de una sola fuente de verdad (seo-rutas.js), todos los
//  archivos que los buscadores y los asistentes de IA esperan encontrar:
//
//    dist/<ruta>.html              un HTML por página con sus propios metadatos
//    dist/sitemap.xml              mapa del sitio
//    dist/robots.txt               permisos de rastreo
//    dist/llms.txt                 resumen del sitio para asistentes de IA
//    dist/llms-full.txt            versión extendida con el detalle del negocio
//    dist/.well-known/security.txt a quién avisar de un fallo de seguridad
//
//  Se ejecuta solo al final de `npm run build`. Si se añade una página a
//  seo-rutas.js, aparece automáticamente en todos los archivos: no hay listas
//  paralelas que se puedan desincronizar.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { loadEnv } from "vite"
import { RUTAS, SITIO, NEGOCIO } from "./seo-rutas.js"

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..")
const DIST = join(RAIZ, "dist")
const PLANTILLA = join(DIST, "index.html")

const hoy = new Date().toISOString().slice(0, 10)
const indexables = RUTAS.filter(pagina => !pagina.noIndex)

const escapar = (texto) => String(texto)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")

const escribir = (rutaRelativa, contenido) => {
  const destino = join(DIST, rutaRelativa)
  mkdirSync(dirname(destino), { recursive: true })
  writeFileSync(destino, contenido, "utf8")
}

if (!existsSync(PLANTILLA)) {
  console.error("✗ No existe dist/index.html — ejecuta `vite build` primero.")
  process.exit(1)
}

// ── 1. Un HTML por página ────────────────────────────────────────────────────
// No se renderiza React: se copia el index.html y se cambian los metadatos. Así
// los rastreadores que no ejecutan JavaScript (WhatsApp, Facebook, ChatGPT,
// Perplexity) reciben el título y la imagen de la página correcta.

const cambiarMeta = (html, atributo, clave, valor) => {
  const patron = new RegExp(
    `(<meta[^>]*${atributo}=["']${clave}["'][^>]*content=["'])[^"']*(["'])`,
    "i"
  )
  return patron.test(html) ? html.replace(patron, `$1${escapar(valor)}$2`) : html
}

// ── 0. Analítica sin cookies (Cloudflare Web Analytics) ──────────────────────
// El beacon solo se inyecta si hay token configurado. Sin token no se añade
// nada: no queda un <script> roto ni se envía nada a ningún sitio.
//
// El token se busca en el entorno del sistema (Vercel, CI) y también en los
// archivos .env de la carpeta frontend, usando el mismo cargador que Vite.
// Node no lee los .env por su cuenta, y sin esto habría que exportar la
// variable a mano en cada terminal.
const desdeArchivos = loadEnv("production", RAIZ, "")
const TOKEN_ANALITICA =
  process.env.CF_ANALYTICS_TOKEN || desdeArchivos.CF_ANALYTICS_TOKEN || ""

const inyectarAnalitica = (html) => {
  if (!TOKEN_ANALITICA || html.includes("cloudflareinsights")) return html
  const beacon =
    `    <script defer src="https://static.cloudflareinsights.com/beacon.min.js"\n` +
    `            data-cf-beacon='{"token": "${TOKEN_ANALITICA}"}'></script>\n`
  return html.replace(/(\s*)<\/body>/i, `\n${beacon}$1</body>`)
}

let base = readFileSync(PLANTILLA, "utf8")

if (TOKEN_ANALITICA) {
  base = inyectarAnalitica(base)
  writeFileSync(PLANTILLA, base, "utf8") // la portada también lo lleva
}

let paginasGeneradas = 0

for (const pagina of RUTAS) {
  if (pagina.ruta === "/") continue // la portada ya la genera Vite

  const url = `${SITIO}${pagina.ruta}`
  let html = base
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapar(pagina.titulo)}</title>`)
    .replace(
      /(<link[^>]*rel=["']canonical["'][^>]*href=["'])[^"']*(["'])/i,
      `$1${url}$2`
    )

  html = cambiarMeta(html, "name", "description", pagina.descripcion)
  html = cambiarMeta(html, "property", "og:title", pagina.titulo)
  html = cambiarMeta(html, "property", "og:description", pagina.descripcion)
  html = cambiarMeta(html, "property", "og:url", url)
  html = cambiarMeta(html, "name", "twitter:title", pagina.titulo)
  html = cambiarMeta(html, "name", "twitter:description", pagina.descripcion)

  if (pagina.noIndex) html = cambiarMeta(html, "name", "robots", "noindex, follow")

  escribir(pagina.archivo || `${pagina.ruta.replace(/^\//, "")}.html`, html)
  paginasGeneradas++
}

const estadoAnalitica = TOKEN_ANALITICA
  ? "✓ analítica sin cookies inyectada"
  : "· analítica: sin token (define CF_ANALYTICS_TOKEN para activarla)"

// ── 2. Sitemap ───────────────────────────────────────────────────────────────
// Solo las indexables: listar una página que pides no indexar es contradictorio.
escribir("sitemap.xml", [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexables.map(pagina =>
    `  <url>\n    <loc>${SITIO}${pagina.ruta}</loc>\n    <lastmod>${hoy}</lastmod>\n  </url>`
  ),
  "</urlset>",
  "",
].join("\n"))

// ── 3. robots.txt ────────────────────────────────────────────────────────────
escribir("robots.txt", `# ${SITIO}

User-agent: *
Allow: /

# El panel administrativo no debe indexarse nunca
Disallow: /admin
Disallow: /admin/

Sitemap: ${SITIO}/sitemap.xml
`)

// ── 4. llms.txt ──────────────────────────────────────────────────────────────
// Convención de llmstxt.org: un resumen en Markdown para que los asistentes de
// IA describan el negocio con precisión en lugar de deducirlo del HTML.
escribir("llms.txt", `# ${NEGOCIO.nombre}

> ${NEGOCIO.descripcion}

- Más de ${NEGOCIO.anosExperiencia} años de experiencia en ${NEGOCIO.pais}.
- Cobertura: ${NEGOCIO.sedes.join(", ")}.
- Contacto: ${NEGOCIO.correo} · ${NEGOCIO.telefono}

## Páginas

${indexables.map(p => `- [${p.titulo.split("|")[0].trim()}](${SITIO}${p.ruta}): ${p.descripcion}`).join("\n")}

## Servicios

${NEGOCIO.servicios.map(s => `- **${s.nombre}**: ${s.descripcion}`).join("\n")}
`)

// ── 5. llms-full.txt ─────────────────────────────────────────────────────────
// Versión extendida: incluye el detalle en el propio archivo, para que un
// asistente pueda responder sin visitar cada página.
escribir("llms-full.txt", `# ${NEGOCIO.nombre}

${NEGOCIO.lema}

## Qué hacemos

${NEGOCIO.descripcion}

Llevamos más de ${NEGOCIO.anosExperiencia} años desarrollando proyectos de energía
renovable en ${NEGOCIO.pais}, con presencia en ${NEGOCIO.sedes.join(", ")}.

## Servicios

${NEGOCIO.servicios.map(s => `### ${s.nombre}\n\n${s.descripcion}`).join("\n\n")}

## Cobertura geográfica

Atendemos proyectos en todo el ${NEGOCIO.pais}, con sedes en ${NEGOCIO.sedes.join(", ")}.

## Contacto

- Correo: ${NEGOCIO.correo}
- Teléfono / WhatsApp: ${NEGOCIO.telefono}
- Web: ${SITIO}

Para una cotización sin compromiso se puede usar el formulario de ${SITIO}/contacto
o el chat de la web.

## Mapa del sitio

${indexables.map(p => `- ${p.titulo.split("|")[0].trim()} — ${SITIO}${p.ruta}\n  ${p.descripcion}`).join("\n")}

---
Última actualización: ${hoy}
`)

// ── 6. security.txt (RFC 9116) ───────────────────────────────────────────────
// Le dice a quien encuentre un fallo de seguridad a dónde escribir, en vez de
// que lo publique o lo explote. La fecha de expiración es obligatoria.
const expira = new Date()
expira.setFullYear(expira.getFullYear() + 1)

escribir(".well-known/security.txt", `Contact: mailto:${NEGOCIO.correo}
Expires: ${expira.toISOString().slice(0, 19)}.000Z
Preferred-Languages: es, en
Canonical: ${SITIO}/.well-known/security.txt
`)

// ── Resumen ──────────────────────────────────────────────────────────────────
console.log(`
  ✓ ${paginasGeneradas} páginas HTML con metadatos propios
  ✓ sitemap.xml         ${indexables.length} páginas (${RUTAS.length - indexables.length} excluidas por estar sin contenido)
  ✓ robots.txt
  ✓ llms.txt            ${NEGOCIO.servicios.length} servicios descritos
  ✓ llms-full.txt
  ✓ .well-known/security.txt
  ${estadoAnalitica}

✅ SEO compilado`)
