// Metadatos por página. Son los textos que Google muestra en sus resultados y
// los que aparecen al compartir el enlace por WhatsApp, así que se escriben
// pensando en lo que la gente busca, no en jerga interna.
//
// Guía: título de 50-60 caracteres con la palabra clave al inicio y la marca al
// final; descripción de 150-160 caracteres que invite a hacer clic.

export const SITIO = "https://proenergim.com"

// Única fuente de verdad sobre el negocio. De aquí salen los datos
// estructurados, llms.txt y security.txt: si cambia un teléfono o una sede,
// se cambia aquí y todos los archivos se regeneran coherentes.
export const NEGOCIO = {
  nombre: "Proenergim E.I.R.L.",
  lema: "Energía solar que transforma tu mundo",
  descripcion:
    "Empresa peruana especializada en soluciones de energía renovable. Diseñamos, instalamos y damos mantenimiento a sistemas solares fotovoltaicos y de bombeo solar para empresas, hogares, agroindustria y comunidades rurales.",
  anosExperiencia: 15,
  correo: "waguilar@proenergim.com",
  telefono: "+51936954890",
  pais: "Perú",
  sedes: ["Lima", "Trujillo", "Tumbes", "Madre de Dios"],
  servicios: [
    {
      nombre: "Instalación de paneles solares",
      descripcion:
        "Sistemas fotovoltaicos conectados a red o autónomos para empresas, hogares e industria, dimensionados según el consumo real de cada cliente.",
    },
    {
      nombre: "Bombeo solar",
      descripcion:
        "Sistemas de bombeo de agua alimentados con energía solar para riego agrícola, ganadería y abastecimiento en zonas rurales sin red eléctrica.",
    },
    {
      nombre: "Mantenimiento y soporte",
      descripcion:
        "Revisión, limpieza y mantenimiento correctivo de instalaciones solares, con soporte técnico continuo.",
    },
  ],
}

export const RUTAS = [
  {
    ruta: "/",
    archivo: "index.html", // ya lo genera Vite; se deja tal cual
    titulo: "Energía solar en Perú — Paneles y bombeo solar | Proenergim",
    descripcion:
      "Instalamos energía solar en todo el Perú: paneles fotovoltaicos, bombeo solar y proyectos para empresas, hogares y agro. Más de 15 años de experiencia.",
  },
  {
    ruta: "/soluciones",
    titulo: "Soluciones de energía solar en Perú | Proenergim",
    descripcion:
      "Sistemas fotovoltaicos, bombeo solar y eficiencia energética a medida. Diseñamos e instalamos la solución solar que tu empresa, hogar o campo necesita.",
  },
  {
    ruta: "/productos",
    titulo: "Paneles solares, inversores y bombas | Proenergim",
    descripcion:
      "Paneles fotovoltaicos, inversores, baterías y bombas solares con garantía. Consulta precios y pide tu cotización sin compromiso en todo el Perú.",
  },
  {
    ruta: "/proyectos",
    titulo: "Proyectos de energía solar ejecutados en Perú | Proenergim",
    descripcion:
      "Conoce las instalaciones solares que hemos ejecutado en Lima, Trujillo, Tumbes y Madre de Dios para empresas, agroindustria y comunidades rurales.",
  },
  {
    ruta: "/nosotros",
    titulo: "Sobre Proenergim: 15 años de energía renovable en Perú",
    descripcion:
      "Somos una empresa peruana especializada en energía renovable. Más de 15 años instalando soluciones solares para empresas, hogares y el sector agrícola.",
  },
  {
    ruta: "/contacto",
    titulo: "Contacto — Cotiza tu sistema solar | Proenergim",
    descripcion:
      "Escríbenos y te preparamos una cotización sin compromiso. Atendemos proyectos de energía solar en Lima, Trujillo, Tumbes y Madre de Dios.",
  },
  {
    ruta: "/politica-privacidad",
    titulo: "Política de privacidad | Proenergim",
    descripcion:
      "Qué datos personales recogemos en proenergim.com, para qué los usamos y cómo ejercer tus derechos de acceso, rectificación y cancelación (Ley 29733).",
  },
  {
    ruta: "/terminos-condiciones",
    titulo: "Términos y condiciones | Proenergim",
    descripcion:
      "Condiciones de uso de proenergim.com: solicitudes de cotización, precios referenciales, reseñas, propiedad intelectual y ley aplicable en Perú.",
  },
]
