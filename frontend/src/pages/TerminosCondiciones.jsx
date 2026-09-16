import { Link } from "react-router-dom"
import { PaginaLegal, Seccion, Lista } from "../components/PaginaLegal"

const CORREO = "waguilar@proenergim.com"

function TerminosCondiciones() {
  return (
    <PaginaLegal
      titulo="Términos y condiciones"
      resumen="Estas son las condiciones bajo las que ponemos a tu disposición este sitio web y la información que contiene."
      actualizado="16 de septiembre de 2026"
    >
      <Seccion titulo="Aceptación">
        <p>
          Al navegar por <strong>proenergim.com</strong>, usar sus formularios o su chat,
          aceptas estas condiciones. Si no estás de acuerdo con alguna de ellas, te pedimos
          que no utilices el sitio.
        </p>
      </Seccion>

      <Seccion titulo="Quiénes somos">
        <p>
          <strong>Proenergim E.I.R.L.</strong> es una empresa peruana dedicada al diseño,
          instalación y mantenimiento de sistemas de energía solar fotovoltaica y de bombeo
          solar, con más de 15 años de experiencia y presencia en Lima, Trujillo, Tumbes y
          Madre de Dios.
        </p>
      </Seccion>

      <Seccion titulo="Este sitio no es una tienda en línea">
        <p>
          Es importante que quede claro: <strong>en esta web no se realizan pagos ni se
          perfeccionan compras</strong>. Cuando usas el botón de solicitar un producto, nos
          envías una <strong>solicitud de cotización</strong>, no una orden de compra.
        </p>
        <p>A partir de ahí:</p>
        <Lista
          items={[
            "Nos pondremos en contacto contigo para entender qué necesitas.",
            "Te enviaremos una cotización formal con el alcance, el precio y los plazos.",
            "La venta se cierra por el canal que acordemos, fuera de este sitio, con su propio contrato o comprobante.",
          ]}
        />
      </Seccion>

      <Seccion titulo="Precios e información de productos">
        <p>
          Los precios y las características que se muestran en la web son{" "}
          <strong>referenciales</strong> y pueden variar sin previo aviso, entre otras cosas
          por el tipo de cambio, la disponibilidad del proveedor o las condiciones
          particulares de cada instalación.
        </p>
        <p>
          El precio que vale es el de la cotización formal que te entreguemos, dentro de su
          plazo de vigencia. Ponemos cuidado en que la información publicada sea correcta,
          pero no podemos garantizar que esté libre de errores u omisiones.
        </p>
      </Seccion>

      <Seccion titulo="Uso del sitio">
        <p>Al usar esta web te comprometes a:</p>
        <Lista
          items={[
            "Entregar información veraz en los formularios, incluido un teléfono o correo de contacto real.",
            "No usar el sitio para fines ilícitos ni para enviar contenido ofensivo, publicitario no solicitado o engañoso.",
            "No intentar acceder a áreas restringidas, alterar el funcionamiento del sitio ni realizar acciones que lo dañen o lo sobrecarguen.",
          ]}
        />
      </Seccion>

      <Seccion titulo="Reseñas y contenido de los usuarios">
        <p>
          Si publicas una reseña, nos autorizas a mostrarla en el sitio junto al nombre que
          hayas indicado. Te pedimos que refleje tu experiencia real con nosotros.
        </p>
        <p>
          Nos reservamos el derecho de no publicar o retirar reseñas con contenido ofensivo,
          datos personales de terceros, publicidad o afirmaciones manifiestamente falsas.
        </p>
      </Seccion>

      <Seccion titulo="Propiedad intelectual">
        <p>
          Los textos, imágenes, logotipos, fotografías de proyectos y el diseño de este
          sitio pertenecen a Proenergim E.I.R.L. o se usan con autorización. Puedes verlos
          y compartir enlaces, pero no reproducirlos con fines comerciales sin nuestro
          permiso por escrito.
        </p>
      </Seccion>

      <Seccion titulo="Enlaces y servicios de terceros">
        <p>
          El sitio incluye enlaces a WhatsApp y puede enlazar a otras plataformas. Esos
          servicios se rigen por sus propias condiciones, que no controlamos y de las que
          no respondemos.
        </p>
      </Seccion>

      <Seccion titulo="Disponibilidad">
        <p>
          Procuramos que el sitio esté siempre disponible, pero puede haber interrupciones
          por mantenimiento, fallos técnicos o causas ajenas a nosotros. No garantizamos
          que el servicio sea ininterrumpido ni libre de errores.
        </p>
      </Seccion>

      <Seccion titulo="Responsabilidad">
        <p>
          La información de esta web tiene carácter informativo y no sustituye a una
          evaluación técnica de tu caso concreto. El dimensionamiento de un sistema solar
          depende de tu consumo, tu ubicación y las condiciones de la instalación, y
          requiere una visita o un análisis previo.
        </p>
        <p>
          No respondemos por decisiones tomadas únicamente a partir del contenido general
          publicado aquí, sin una cotización ni una evaluación técnica de por medio.
        </p>
      </Seccion>

      <Seccion titulo="Protección de datos">
        <p>
          El tratamiento de los datos que nos facilitas se explica en nuestra{" "}
          <Link to="/politica-privacidad" className="text-[var(--color-primary)] font-semibold hover:underline">
            política de privacidad
          </Link>
          , que forma parte de estas condiciones.
        </p>
      </Seccion>

      <Seccion titulo="Ley aplicable">
        <p>
          Estas condiciones se rigen por la legislación peruana. Cualquier controversia se
          someterá a los jueces y tribunales competentes del Perú, sin perjuicio de los
          derechos que la normativa de protección al consumidor te reconoce ante{" "}
          <strong>INDECOPI</strong>.
        </p>
      </Seccion>

      <Seccion titulo="Contacto">
        <p>
          Para cualquier consulta sobre estas condiciones, escríbenos a{" "}
          <a href={`mailto:${CORREO}`} className="text-[var(--color-primary)] font-semibold hover:underline">{CORREO}</a>.
        </p>
      </Seccion>
    </PaginaLegal>
  )
}

export default TerminosCondiciones
