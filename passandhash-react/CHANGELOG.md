# Changelog

## 1.0.0-rc.1 - 2026-02-16

### Added

- i18n ES/EN con selector de idioma y persistencia en `localStorage`.
- Presets de seguridad para `bcrypt` y `Argon2` con opción de restaurar defaults.
- Hardening de entradas en capa utilitaria:
  - límites de longitud para password/hash
  - sanitización uniforme
  - códigos de error tipificados
- Smoke E2E con Playwright (`e2e/smoke.spec.ts`).
- Script de `typecheck` (`tsc --noEmit`).
- Migración gradual de `src/utils` a TypeScript (`src/utils/utils.ts`).
- Documentación de board/seguridad/release candidate.

### Changed

- Mejoras A11y y semántica en formularios.
- CI actualizado para ejecutar smoke E2E.
- Cobertura de tests ampliada a flujos de i18n y hardening.
- Integración Argon2 browser estabilizada.

### Fixed

- Pantalla en blanco causada por carga incompatible de Argon2.
- Ajustes de selectors y estabilidad en pruebas E2E.
