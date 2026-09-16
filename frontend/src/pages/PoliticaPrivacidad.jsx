import { PaginaLegal, Seccion, Lista } from "../components/PaginaLegal"

const CORREO = "waguilar@proenergim.com"

function PoliticaPrivacidad() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      resumen="Explicamos qué datos personales recogemos en este sitio, para qué los usamos y cómo puedes pedirnos que los corrijamos o los eliminemos."
      actualizado="16 de septiembre de 2026"
    >
      <Seccion titulo="Quién trata tus datos">
        <p>
          El responsable del tratamiento es <strong>Proenergim E.I.R.L.</strong>, empresa
          peruana dedicada a soluciones de energía renovable, con domicilio en Perú.
          Para cualquier asunto relacionado con tus datos personales puedes escribirnos
          a <a href={`mailto:${CORREO}`} className="text-[var(--color-primary)] font-semibold hover:underline">{CORREO}</a>.
        </p>
        <p>
          Esta política se rige por la <strong>Ley N.° 29733, Ley de Protección de Datos
          Personales</strong>, y su reglamento aprobado por Decreto Supremo N.° 003-2013-JUS.
        </p>
      </Seccion>

      <Seccion titulo="Qué datos recogemos y cuándo">
        <p>Solo recogemos los datos que tú nos entregas voluntariamente al usar alguna de estas funciones:</p>
        <Lista
          items={[
            <><strong>Formulario de contacto:</strong> tu nombre y tu número de teléfono.</>,
            <><strong>Chat de la web:</strong> tu nombre, tu ciudad y el tema de tu consulta.</>,
            <><strong>Solicitud de cotización de un producto:</strong> tu nombre, celular, correo electrónico y la descripción de lo que necesitas.</>,
            <><strong>Suscripción a novedades:</strong> únicamente tu correo electrónico.</>,
            <><strong>Reseñas:</strong> el nombre que elijas mostrar, tu comentario y tu calificación.</>,
          ]}
        />
        <p>
          También llevamos un <strong>contador de visitas</strong> del sitio. Ese contador
          registra solo la fecha y hora de la visita: <strong>no guarda tu dirección IP, ni
          tu navegador, ni ningún dato que permita identificarte</strong>.
        </p>
      </Seccion>

      <Seccion titulo="Para qué usamos tus datos">
        <Lista
          items={[
            "Responder tus consultas y prepararte una cotización.",
            "Contactarte por teléfono, WhatsApp o correo sobre el proyecto que nos planteaste.",
            "Enviarte novedades y promociones, solo si te suscribiste voluntariamente.",
            "Publicar tu reseña en la web, si decidiste escribir una.",
            "Conocer cuánta gente visita el sitio, de forma agregada y anónima.",
          ]}
        />
        <p>
          <strong>No usamos tus datos para perfilarte ni para tomar decisiones automatizadas</strong>,
          y no los vendemos ni los cedemos a terceros con fines comerciales.
        </p>
      </Seccion>

      <Seccion titulo="Con quién los compartimos">
        <p>
          <strong>No vendemos, alquilamos ni cedemos tus datos a terceros con fines
          comerciales.</strong> Tampoco los compartimos con anunciantes ni con redes
          sociales.
        </p>
        <p>
          Para prestarte el servicio nos apoyamos en proveedores tecnológicos que actúan
          como <strong>encargados del tratamiento</strong>: procesan los datos únicamente
          siguiendo nuestras instrucciones y bajo obligación de confidencialidad. La Ley
          N.° 29733 nos exige informarte de su existencia:
        </p>
        <Lista
          items={[
            <><strong>Alojamiento de la base de datos:</strong> un proveedor de infraestructura en la nube (MongoDB Atlas) conserva de forma segura los datos que nos dejas en los formularios.</>,
            <><strong>Envío de correo electrónico:</strong> un proveedor de correo (Google) transmite las notificaciones internas de tus consultas y, si te suscribiste, nuestras novedades.</>,
            <><strong>Alojamiento de imágenes:</strong> un servicio de almacenamiento multimedia (Cloudinary) guarda las fotografías de nuestros productos. No recibe ningún dato personal tuyo.</>,
            <><strong>Medición de visitas:</strong> un servicio de analítica web sin cookies (Cloudflare Web Analytics) nos indica de forma agregada cuántas personas visitan cada página. No te identifica ni te sigue entre sitios.</>,
          ]}
        />
        <p>
          Estos proveedores pueden almacenar la información en servidores ubicados fuera
          del Perú, lo que constituye un <strong>flujo transfronterizo de datos</strong>.
          Al facilitarnos tus datos aceptas esa transferencia, que se realiza hacia
          proveedores que aplican medidas de seguridad equivalentes a las exigidas por la
          normativa peruana.
        </p>
        <p>
          Si decides escribirnos por WhatsApp, esa conversación se rige además por las
          condiciones y la política de privacidad de dicha plataforma, que no controlamos.
        </p>
        <p>
          También podremos comunicar tus datos cuando una autoridad competente nos lo
          requiera en el marco de la ley.
        </p>
      </Seccion>

      <Seccion titulo="Cuánto tiempo los conservamos">
        <p>
          Conservamos tus datos mientras sean necesarios para atender tu consulta y durante
          el tiempo que exija la normativa aplicable. Si te suscribiste a nuestras novedades,
          mantenemos tu correo hasta que nos pidas darte de baja. Puedes solicitar la
          eliminación en cualquier momento escribiéndonos.
        </p>
      </Seccion>

      <Seccion titulo="Tus derechos">
        <p>
          La ley peruana te reconoce los derechos de <strong>acceso, rectificación,
          cancelación y oposición</strong> sobre tus datos personales. En concreto, puedes
          pedirnos:
        </p>
        <Lista
          items={[
            "Saber qué datos tuyos tenemos y de dónde los obtuvimos.",
            "Corregir los que estén equivocados o incompletos.",
            "Eliminarlos de nuestros registros.",
            "Oponerte a que los sigamos usando.",
            "Darte de baja de nuestros correos, sin tener que explicar por qué.",
          ]}
        />
        <p>
          Para ejercerlos, escríbenos a{" "}
          <a href={`mailto:${CORREO}`} className="text-[var(--color-primary)] font-semibold hover:underline">{CORREO}</a>{" "}
          indicando qué derecho quieres ejercer. Te responderemos en los plazos que fija la ley.
        </p>
        <p>
          Si consideras que no atendimos tu solicitud correctamente, puedes acudir a la
          <strong> Autoridad Nacional de Protección de Datos Personales</strong> del
          Ministerio de Justicia y Derechos Humanos.
        </p>
      </Seccion>

      <Seccion titulo="Cookies y almacenamiento en tu navegador">
        <p>
          <strong>Este sitio no instala cookies.</strong> Tampoco usamos Google Analytics,
          el píxel de Facebook ni ninguna herramienta que te siga de un sitio web a otro
          para mostrarte publicidad.
        </p>
        <p>
          Para saber cuánta gente nos visita usamos una herramienta de analítica
          <strong> sin cookies</strong>, que mide de forma agregada qué páginas se ven y
          desde qué país y tipo de dispositivo. <strong>No crea un identificador tuyo, no
          te reconoce en visitas posteriores y no comparte nada con anunciantes.</strong>
          {" "}Por eso no necesitamos mostrarte un banner de cookies.
        </p>
        <p>
          Sí guardamos tres cosas en el almacenamiento local de tu propio navegador, que
          nunca salen de tu dispositivo:
        </p>
        <Lista
          items={[
            "El historial de tu conversación en el chat, para que no se pierda si recargas la página.",
            "Una marca para no volver a mostrarte la pantalla de bienvenida en la misma sesión.",
            "Una marca para no contar tu visita más de una vez por sesión.",
          ]}
        />
        <p>
          Puedes borrarlas cuando quieras desde la configuración de tu navegador.
        </p>
      </Seccion>

      <Seccion titulo="Seguridad">
        <p>
          Aplicamos medidas técnicas para proteger tu información: el sitio se sirve
          íntegramente sobre conexión cifrada (HTTPS), el acceso al panel administrativo
          está protegido con contraseña y verificación en dos pasos, y los datos se
          almacenan en servidores de terceros con controles de acceso restringido.
        </p>
        <p>
          Ningún sistema es infalible. Si detectas un problema de seguridad en este sitio,
          te agradecemos que nos escribas a{" "}
          <a href={`mailto:${CORREO}`} className="text-[var(--color-primary)] font-semibold hover:underline">{CORREO}</a>{" "}
          antes de divulgarlo.
        </p>
      </Seccion>

      <Seccion titulo="Menores de edad">
        <p>
          Nuestros servicios están dirigidos a personas mayores de edad con capacidad para
          contratar. <strong>No recogemos de forma consciente datos personales de menores
          de edad</strong> ni dirigimos nuestra publicidad a ellos.
        </p>
        <p>
          El tratamiento de datos de menores requiere el consentimiento de quienes ejerzan
          la patria potestad o la tutela, en los términos que establece la normativa
          peruana de protección de datos personales.
        </p>
        <p>
          Si eres madre, padre o tutor y detectas que un menor a tu cargo nos ha facilitado
          sus datos sin tu autorización, escríbenos a{" "}
          <a href={`mailto:${CORREO}`} className="text-[var(--color-primary)] font-semibold hover:underline">{CORREO}</a>{" "}
          y los eliminaremos de nuestros registros.
        </p>
      </Seccion>

      <Seccion titulo="Cambios en esta política">
        <p>
          Podemos actualizar esta política si cambian nuestros servicios o la normativa
          aplicable. La fecha de la última actualización aparece al inicio de esta página.
        </p>
      </Seccion>
    </PaginaLegal>
  )
}

export default PoliticaPrivacidad
