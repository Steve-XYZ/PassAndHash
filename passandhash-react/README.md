# PassAndHash (React)

Aplicación web para trabajar localmente con contraseñas y hashes en el navegador:

- Generación de hash con `bcrypt`, `argon2`, `sha256`, `sha512`.
- Verificación de hash para `bcrypt`, `argon2`, `sha256`, `sha512`.
- Generador de contraseñas aleatorias con reglas de complejidad.
- Medidor de fortaleza y toasts de feedback.
- Tema claro/oscuro persistido en `localStorage`.

## Stack

- React 19
- Vite (rolldown-vite)
- bcryptjs
- argon2-browser (WASM)
- ESLint
- Vitest + Testing Library

## Requisitos

- Node.js 20+
- npm 10+ (o pnpm 9+)

## Ejecución local

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
npm run preview
```

## Seguridad y alcance

- Esta app ejecuta operaciones criptográficas del lado cliente.
- El hash no reemplaza políticas de backend: en producción real, la verificación final y controles de autenticación deben vivir en servidor.
- Para `argon2`, los parámetros afectan rendimiento y resistencia: subir memoria/iteraciones mejora costo de ataque pero aumenta tiempo de cómputo.

## Estructura principal

- `src/components/HashGenerator.jsx`: flujo de generación.
- `src/components/HashVerifier.jsx`: flujo de validación.
- `src/components/PasswordGenerator.jsx`: generador de contraseñas.
- `src/utils/utils.js`: utilidades criptográficas.
- `src/contexts/ToastContext.jsx`: estado global de notificaciones.

## Estado de calidad

- Lint configurado con ESLint.
- Pruebas unitarias/componentes críticas con Vitest.
- CI preparado para validar `lint`, `test` y `build` en push/PR.
