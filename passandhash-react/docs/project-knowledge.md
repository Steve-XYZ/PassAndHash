# PassAndHash - Knowledge Base

## 1) Objetivo del producto

PassAndHash es una aplicación web (React + Vite) para trabajar con contraseñas y hashes directamente en el navegador.

Casos de uso actuales:

- Generar hashes de contraseñas con `bcrypt`, `Argon2`, `SHA-256`, `SHA-512`.
- Verificar si una contraseña coincide con un hash (`bcrypt`, `Argon2`, `SHA-256`, `SHA-512`).
- Generar contraseñas aleatorias seguras con reglas configurables.
- Medir fortaleza de contraseña en tiempo real.

## 2) Stack técnico

- Frontend: React 19
- Bundler/dev server: Vite 7
- Criptografía:
  - `bcryptjs`
  - `argon2-browser` (cargado vía script global para compatibilidad runtime)
  - Web Crypto API (`crypto.subtle`) para SHA
- Testing:
  - Vitest
  - Testing Library (`@testing-library/react`, `user-event`, `jest-dom`)
- Lint:
  - ESLint 9

## 3) Estructura del proyecto (resumen)

- `src/components/HashGenerator.jsx`
  - UI para generar hash, presets de seguridad y parámetros.
- `src/components/PasswordGenerator.jsx`
  - UI para generar contraseña aleatoria.
- `src/components/HashVerifier.jsx`
  - UI para verificar hash vs password.
- `src/utils/utils.js`
  - Lógica criptográfica centralizada (generación/verificación).
- `src/lib/argon2.js`
  - Wrapper de Argon2 desde `globalThis.argon2`.
- `src/contexts/ToastContext.jsx`
  - Context provider para toasts.
- `src/contexts/LanguageProvider.jsx`
  - Provider de i18n (ES/EN) con persistencia de idioma.
- `src/hooks/useToast.js`
  - Hook de acceso al contexto de toast.
- `src/hooks/useI18n.js`
  - Hook para traducciones y estado de idioma.
- `src/index.css`
  - Estilos globales, layout, responsive, tema y componentes visuales.
- `public/argon2-bundled.min.js`
  - Bundle Argon2 cargado antes de `main.jsx`.

## 4) Cómo funciona internamente

### 4.1 Generación de hash

- `HashGenerator` arma un objeto de opciones y llama `generateHashWithOptions(...)`.
- En `utils.js`:
  - `bcrypt`: valida y sanea rounds, genera salt y hash.
  - `argon2`: sanea `memoryCost`, `iterations`, `parallelism`, genera hash encoded.
  - `sha256/sha512`: usa `crypto.subtle.digest` y convierte a hex.

### 4.2 Verificación de hash

- `HashVerifier` llama `verifyHashWithOptions(...)`.
- En `utils.js`:
  - `bcrypt`: `bcrypt.compare`.
  - `argon2`: `argon2.verify`.
  - `sha256/sha512`: recalcula hash y compara en lowercase.

### 4.3 Generación de contraseñas

- Usa `window.crypto.getRandomValues` para seleccionar caracteres.
- Fuerza inclusión de tipos seleccionados (mayúsculas/minúsculas/números/símbolos).
- Baraja resultado final para evitar patrones.

### 4.4 Layout actual

- Los 3 módulos principales se muestran en grilla responsive:
  - Desktop: 3 columnas.
  - Tablet: 2 columnas.
  - Mobile: 1 columna.

## 5) Cómo levantar el proyecto localmente

## Requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+ (o compatible)

## Instalación

```bash
cd passandhash-react
npm install
```

## Desarrollo (localhost)

```bash
npm run dev
```

Abre: `http://127.0.0.1:5173/` (o la URL que imprima Vite).

## Verificaciones de calidad

```bash
npm run lint
npm run test
npm run build
```

## 6) Problemas comunes y diagnóstico rápido

### Pantalla en blanco

Posibles causas:

- Script de Argon2 no cargado.
- Error de runtime al iniciar React.

Checklist:

1. Confirmar que exista `public/argon2-bundled.min.js`.
2. Confirmar en `index.html` que se carga:
   - `<script src="/argon2-bundled.min.js"></script>` antes de `main.jsx`.
3. Revisar consola del navegador (errores JS).

### Errores de build con Argon2

- Este proyecto usa carga global de Argon2 para evitar conflictos de bundling de `.wasm`.
- Si se cambia esta integración, volver a validar `npm run build`.

## 7) Estado de testing

Actualmente cubierto:

- Utilidades criptográficas (`src/utils/utils.test.js`).
- Casos de UI de `HashGenerator` y `HashVerifier`.
- Selector de idioma y persistencia (`src/components/LanguageSelector.test.jsx`).

Comando:

```bash
npm run test
```

## 8) Estado de roadmap

Completado:

1. Sprint 1: Base A11y y semántica de formularios.
2. Sprint 2: i18n ES/EN + persistencia + estandarización de mensajes.
3. Sprint 3: presets `bcrypt`/`Argon2` + restauración de defaults.
4. Sprint 4: hardening de entradas + códigos de error + remediación de vulnerabilidades.

Pendiente (siguiente etapa):

1. TypeScript gradual:
   - Empezar por utilidades y tipos del dominio de hash.
2. Más cobertura de tests:
   - Integración avanzada y cobertura adicional de edge cases UI.
3. E2E tests:
   - Playwright para flujos completos en navegador real.

## Prioridad baja (evolución de producto)

1. Modo educativo:
   - Explicar pros/contras de cada algoritmo y parámetros.
2. Exportación de resultados:
   - Copia avanzada / descarga segura local.
3. PWA offline:
   - Uso sin conexión y mejor experiencia en móvil.

## 9) CI/CD

Existe workflow de CI en:

- `.github/workflows/ci.yml`

Valida en push/PR:

- `npm install`
- `npm run lint`
- `npm run test`
- `npm run build`

## 10) Checklist antes de publicar cambios

```bash
npm run lint
npm run test
npm run build
```

Y revisar:

- UI en desktop/tablet/móvil.
- Consola sin errores.
- Flujos de generación/verificación funcionando para los 4 algoritmos.

## 11) Cierre de servidor local

Para detener el entorno local de desarrollo:

```bash
Ctrl + C
```
