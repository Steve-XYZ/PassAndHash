# Release Checklist

## Calidad técnica

- [ ] `npm run lint` sin errores
- [ ] `npm run test` sin fallos
- [ ] `npm run build` exitoso
- [ ] Cobertura base revisada (`npm run test:coverage`)

## Seguridad funcional

- [ ] Validado flujo `bcrypt` (generar/verificar)
- [ ] Validado flujo `argon2` (generar/verificar)
- [ ] Validado flujo `sha256/sha512` (generar/verificar)
- [ ] Validado manejo de errores al copiar al portapapeles

## UX

- [ ] Prueba responsive en móvil y desktop
- [ ] Contrastes y foco de teclado revisados
- [ ] Mensajes de error y éxito consistentes

## Entrega

- [ ] README actualizado
- [ ] CI en verde en rama principal
- [ ] Tag de versión creado
