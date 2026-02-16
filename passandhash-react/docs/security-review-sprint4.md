# Sprint 4 - Security Review

Fecha: 2026-02-16

## Alcance aplicado

1. Limites estrictos de entrada:
   - Password: `1..1024`
   - Hash: `1..4096`
2. Saneo uniforme de entradas:
   - `algorithm` normalizado y validado.
   - `password` validado por longitud.
   - `hash` validado y normalizado (`trim`).
3. Errores criptograficos consistentes:
   - Errores con `error.code` en capa utilitaria (`utils`).
   - Mapeo de codigos a mensajes de UI/i18n.
4. Verificacion SHA:
   - Comparacion por funcion de tiempo constante aproximado (`constantTimeStringEqual`).

## Evidencia de cambios

- `src/utils/utils.js`
  - `SECURITY_LIMITS`
  - `ERROR_CODES`
  - validaciones/saneo centralizados
  - errores tipificados por codigo
- `src/components/HashGenerator.jsx`
  - `maxLength` en input password
  - manejo de errores por `error.code`
- `src/components/HashVerifier.jsx`
  - `maxLength` en password/hash
  - manejo de errores por `error.code`
- `src/i18n/translations.js`
  - mensajes nuevos para errores de hardening
- `src/utils/utils.test.js`
  - pruebas de edge cases de seguridad

## Dependencias y auditoria

Resultado final de auditoria:

- `npm audit --json`
- Vulnerabilidades: `0`

Remediacion aplicada durante sprint:

- Se aplico `npm audit fix`.
- Se corrigio una vulnerabilidad moderada asociada a `js-yaml`.

## Estado de calidad post-hardening

1. `npm run lint` ✅
2. `npm run test` ✅
3. `npm run build` ✅
