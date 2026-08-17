# SismoAlert — App instalable (PWA) y cómo sacar un .apk

## Qué es esta carpeta

`sismoalert-app/` es la misma web de siempre (`index.html`), pero empaquetada
como **PWA** (Progressive Web App): tiene `manifest.json`, íconos, y un
`service-worker.js`. Eso significa que en un celular Android, Chrome puede
"instalarla" como si fuera una app nativa — ícono en el home, pantalla
completa sin barra del navegador, funciona.

Sube esta carpeta completa a un hosting con HTTPS (necesario para que
funcione el service worker). Las opciones más simples y gratis:

- **GitHub Pages**: ya tienes un repo (`sismoalert`) — en Settings → Pages,
  elige la rama y listo, te da una URL `https://tuusuario.github.io/...`
- **Netlify / Vercel**: arrastras la carpeta a su web y listo.

## Paso 1 — Pruébala como PWA (esto ya es real y funciona hoy)

1. Sube `sismoalert-app/` a GitHub Pages (o Netlify).
2. Abre esa URL desde Chrome en tu celular Android.
3. Chrome debería mostrar un banner "Agregar a pantalla de inicio" o
   "Instalar app" — si no aparece solo, toca el menú (⋮) → "Instalar app".
4. Queda como ícono normal, se abre a pantalla completa. Esto **ya es
   funcionalmente una app**, sin necesitar ningún `.apk`.

Esto te sirve para testear en tu propio celular ahora mismo, gratis, sin
Android Studio ni nada más.

## Paso 2 — Si de verdad necesitas un archivo .apk instalable

Un `.apk` real (para instalar sin pasar por Chrome, o subir a una tienda)
requiere compilar con el SDK de Android — eso no está disponible en el
entorno donde generé estos archivos, así que no puedo producir el binario
yo mismo. Dos caminos reales para conseguirlo:

### Opción A — Sin instalar nada en tu compu (recomendado para probar rápido)

1. Ve a **https://www.pwabuilder.com**
2. Pega la URL pública de tu PWA ya desplegada (paso 1).
3. PWABuilder analiza el manifest y te deja descargar un paquete para
   Android (te da un `.apk` o `.aab` listo para instalar/probar).
4. Ese `.apk` lo puedes instalar directo en tu celular (activa "orígenes
   desconocidos" en Ajustes si Android te lo pide) o subirlo a Play Console
   si más adelante quieres publicarla de verdad.

### Opción B — Control total, con Capacitor (necesitas Android Studio local)

Esto te da un proyecto Android real que puedes seguir modificando en
código nativo si algún día lo necesitas.

```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "SismoAlert" "com.tuusuario.sismoalert" --web-dir=sismoalert-app
npx cap add android
npx cap open android
```

Eso abre Android Studio con el proyecto ya armado. Desde ahí:
`Build → Build Bundle(s) / APK(s) → Build APK(s)` te da el `.apk` en
`android/app/build/outputs/apk/debug/app-debug.apk`, instalable directo en
tu celular por USB o transfiriéndolo.

Requiere tener instalado Android Studio (gratis, de developer.android.com)
la primera vez — es una descarga de varios GB, por eso no es algo que se
pueda hacer dentro de este chat.

## Nota sobre el proxy GNSS y el celular

Cuando pruebes la app instalada en tu celular, la URL del proxy GNSS que
configuraste (`https://sismoalert-1.onrender.com`) sigue funcionando igual
— es solo una API HTTPS, no le importa si quien pregunta es un navegador de
escritorio o una app en el celular. No hace falta cambiar nada ahí.
