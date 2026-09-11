// ── Integración nativa (Android/iOS vía Capacitor) ────────────────────────────
// En web todo esto es inerte: se sale antes de cargar cualquier plugin nativo.
import { Capacitor } from "@capacitor/core"

export async function initNative() {
  if (!Capacitor.isNativePlatform()) return

  const [{ App: CapApp }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
    import("@capacitor/app"),
    import("@capacitor/status-bar"),
    import("@capacitor/splash-screen"),
  ])

  // Barra de estado clara con iconos oscuros (el navbar de la app es blanco)
  try {
    await StatusBar.setStyle({ style: Style.Light })
  } catch { /* algunos dispositivos no lo soportan */ }

  // Botón físico "atrás": retrocede en el historial y sale solo desde el inicio
  CapApp.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack && window.history.length > 1) {
      window.history.back()
    } else {
      CapApp.exitApp()
    }
  })

  // Ocultar el splash cuando el bundle ya está montado
  try {
    await SplashScreen.hide()
  } catch { /* ya oculto */ }
}
