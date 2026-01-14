# Registro de Pruebas de Verificación (Browser)

## Versión 1 - Estado Inicial Post-Polish
**Fecha:** 2026-01-13
**Objetivo:** Verificar flujo de Onboarding (PIN), navegación entre vistas y carga de Mapa.

### Pruebas Realizadas
- [x] Onboarding (PIN Gate) - **EXITOSO** (PIN 2026 aceptado).
- [x] Home View (Carga de feeds) - **EXITOSO** (Muestra "Hola, TestUser" y eventos en vivo).
- [x] Calendar View (Itinerario) - **EXITOSO** (Muestra Agenda 2026 y scroll a "Hoy").
- [x] Map View (Pins y Heatmap) - **EXITOSO** (17 marcadores cargados, info panel funcional).
- [x] Wallet View (Nombre de usuario dinámico) - **EXITOSO** (Muestra QR y nombre TestUser).

### Resultados
- Autenticación persistente en `localStorage`.
- Mapa de Leaflet integrado con éxito con 17 locaciones reales.
- El panel de detalles del mapa muestra correctamente el siguiente evento de la locación.
- Rendimiento fluido en transiciones de vista.

---

## Versión 2 - Pruebas de Estrés y Casos de Borde
**Fecha:** 2026-01-13
**Objetivo:** Verificar comportamiento Offline (PWA), validación de PIN erróneo y persistencia tras recarga.

### Pruebas Realizadas
- [ ] Persistencia tras F5 (Recarga de página)
- [ ] Validación de PIN incorrecto
- [ ] Verificación de Service Worker (PWA)
- [ ] Logout y limpieza de sesión

### Resultados
*Pendiente de ejecución.*

---
