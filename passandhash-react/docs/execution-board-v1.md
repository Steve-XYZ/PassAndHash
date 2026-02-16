# PassAndHash - Execution Board v1.0

## Objetivo

Completar el desarrollo del producto hasta una version `v1.0.0` con calidad de produccion:

- UX robusta y accesible.
- Seguridad y validaciones endurecidas.
- Suite de pruebas confiable.
- Documentacion y CI/CD de release.

## Cadencia sugerida

- 8 sprints de 1 semana (recomendado) o 4 sprints de 2 semanas.
- Demo interna al final de cada sprint.
- Merge a `main` solo con `lint`, `test`, `build` en verde.

## Definicion de Done global

Una historia solo se considera terminada si cumple:

1. Codigo implementado y revisado.
2. Tests actualizados/pasando.
3. Build exitoso.
4. Sin regresiones visibles en desktop y mobile.
5. Documentacion minima actualizada.

## Backlog por Epica y Sprint

## Sprint 1 - A11y y UX base

Epica: Accesibilidad operativa del flujo principal.

Historias:

- [x] E1-H1: Navegacion por teclado en formularios principales.
- [x] E1-H2: `aria-live` para resultados y toasts.
- [x] E1-H3: Foco visible consistente en controles.
- [x] E1-H4: Semantica base (`main`, `section`, `form`) en los 3 modulos.

Criterios de aceptacion:

1. Se puede operar el flujo principal sin mouse.
2. Los estados de carga/resultado son anunciables por lector de pantalla.
3. No hay controles interactivos sin etiqueta util.

## Sprint 2 - i18n y mensajes UX

Epica: Internacionalizacion y feedback de errores.

Historias:

- [x] E2-H1: Integrar i18n (ES/EN) con diccionario central.
- [x] E2-H2: Migrar textos de componentes a claves traducibles.
- [x] E2-H3: Estandarizar mensajes de error por tipo de validacion.
- [x] E2-H4: Persistir idioma seleccionado.

Criterios de aceptacion:

1. Toda la UI principal funciona en ES y EN.
2. No quedan strings hardcodeados en componentes core.

## Sprint 3 - Presets y preferencias

Epica: Productividad del usuario recurrente.

Historias:

- [x] E3-H1: Presets para `bcrypt` (basico, recomendado, alto).
- [x] E3-H2: Presets para Argon2 (ligero, recomendado, robusto).
- [x] E3-H3: Guardar/cargar preset activo en almacenamiento local.
- [x] E3-H4: UX de restaurar valores por defecto.

Criterios de aceptacion:

1. Usuario puede aplicar presets en un clic.
2. Preferencias persisten entre sesiones.

## Sprint 4 - Hardening y seguridad

Epica: Endurecimiento de entradas y manejo seguro de errores.

Historias:

- [x] E4-H1: Limites estrictos de tamano para password/hash.
- [x] E4-H2: Saneo uniforme de enteros y textos por algoritmo.
- [x] E4-H3: Politica de errores criptograficos consistente.
- [x] E4-H4: Revisión de dependencias y remediacion de vulnerabilidades.

Criterios de aceptacion:

1. Inputs invalidos no rompen flujo ni generan estados ambiguos.
2. No hay warnings de seguridad pendientes sin plan.

## Sprint 5 - TypeScript gradual

Epica: Confiabilidad del dominio tecnico.

Historias:

- [ ] E5-H1: Migrar `src/utils` a TypeScript.
- [ ] E5-H2: Tipos de opciones por algoritmo (discriminated unions).
- [ ] E5-H3: Tipado de resultados de generacion/verificacion.
- [ ] E5-H4: Ajustar tests al nuevo tipado.

Criterios de aceptacion:

1. Core criptografico 100% tipado.
2. Sin regresiones funcionales ni degradacion de DX.

## Sprint 6 - Testing avanzado y e2e

Epica: Garantia de calidad automatizada.

Historias:

- [ ] E6-H1: Subir cobertura de unit tests en casos edge.
- [ ] E6-H2: Tests de integracion de flujos completos.
- [ ] E6-H3: Implementar E2E (Playwright) para happy/error paths.
- [ ] E6-H4: Publicar cobertura en CI.

Criterios de aceptacion:

1. Suite automatizada estable.
2. Cobertura core >= 80%.

## Sprint 7 - Evolucion funcional

Epica: Valor agregado de producto.

Historias:

- [ ] E7-H1: Modo educativo por algoritmo (descripcion y tradeoffs).
- [ ] E7-H2: Exportacion segura de resultados (txt/json).
- [ ] E7-H3: Historial local opcional y controlado.
- [ ] E7-H4: Ajustes UX para descubrimiento de funciones.

Criterios de aceptacion:

1. Funciones agregadas sin afectar tiempos ni estabilidad.
2. UX clara para usuarios no tecnicos.

## Sprint 8 - Release engineering y v1.0

Epica: Salida formal a produccion.

Historias:

- [ ] E8-H1: Changelog y versionado semantico.
- [ ] E8-H2: Release checklist completo en verde.
- [ ] E8-H3: Prueba de regresion final (desktop/mobile).
- [ ] E8-H4: Publicacion `v1.0.0`.

Criterios de aceptacion:

1. CI verde sostenido.
2. Go-live aprobado con checklist completo.

## Riesgos y mitigaciones

1. Riesgo: regresion por cambios de hashing.
   Mitigacion: tests unitarios por algoritmo y casos invalidos.
2. Riesgo: friccion UX al aumentar complejidad.
   Mitigacion: iteraciones cortas con demo y feedback.
3. Riesgo: dependencia Argon2 en browser.
   Mitigacion: mantener estrategia de carga probada y testear build en cada PR.

## Indicadores de avance

1. % historias completadas por sprint.
2. % cobertura en modulos core.
3. Cantidad de bugs criticos abiertos.
4. Tiempo medio de cierre de incidencias.

## Proxima accion recomendada

Iniciar Sprint 5 (TypeScript gradual) en rama de trabajo:

```bash
git checkout -b feat/sprint-5-typescript
```
