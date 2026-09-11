# App Android (Proenergim)

La app Android es la web de Proenergim empaquetada con **Capacitor**: el mismo
build de Vite (`dist/`) corre dentro de un WebView nativo.

- **Package:** `com.proenergim.app`
- **Nombre:** Proenergim
- **minSdk:** 24 (Android 7.0) · **targetSdk:** 36
- **Versión:** 1.0 (versionCode 1)

## Requisitos

- Node 18+
- Android Studio (aporta el JDK y el SDK). Si `JAVA_HOME` no está configurado:
  `C:\Program Files\Android\Android Studio\jbr`
- `android/local.properties` con la ruta del SDK (usar `/`, no `\`):
  ```
  sdk.dir=C:/Users/MARI/AppData/Local/Android/Sdk
  ```

## Compilar

```bash
npm run build          # genera dist/
npx cap sync android   # copia dist/ + config al proyecto Android
cd android
./gradlew assembleRelease   # APK firmado -> app/build/outputs/apk/release/
./gradlew assembleDebug     # APK de prueba -> app/build/outputs/apk/debug/
```

## Firma

Las credenciales están en `android/keystore.properties` (ignorado por git) y
apuntan a `android/proenergim-release.keystore`.

> **Importante:** guardar una copia del keystore y su contraseña. Sin ese archivo
> no se pueden publicar actualizaciones de la app con el mismo package.

## Detalles de configuración

- **`server.hostname = "proenergim.com"`** (`capacitor.config.json`): el WebView
  sirve la app desde el origen `https://proenergim.com`, que es el que el backend
  ya acepta en su lista de CORS. Sin esto el origen sería `https://localhost` y el
  backend rechazaría todas las llamadas a la API (reseñas, leads, contacto,
  suscripciones, visitas).
- **`src/native.js`**: inicializa barra de estado, oculta el splash y hace que el
  botón físico "atrás" navegue en el historial en vez de cerrar la app. En web no
  hace nada (se sale antes de cargar los plugins nativos).
- **Íconos y splash**: se generan desde `assets/` con
  `npx @capacitor/assets generate --android`.
- Los archivos dentro de `public/` no deben llevar tildes ni caracteres especiales:
  AAPT falla al empaquetarlos.

## Tamaño

El APK pesa ~104 MB porque `public/videos/` (95 MB) va empaquetado dentro para
que la app funcione sin conexión. Comprimir esos videos reduciría el APK a unos
15-20 MB y también aceleraría el sitio web.
