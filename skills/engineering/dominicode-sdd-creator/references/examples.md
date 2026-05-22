# Ejemplo trabajado — Generador de facturas para freelancers

> Este es un spec real, completo, pensado para que veas cómo se rellenan las 6 secciones sin abstracciones. Úsalo de calibración.

---

## SECCIÓN 1 — Visión del producto

Una herramienta web para que freelancers gestionen proyectos y generen facturas desde un solo lugar, sin tener que mantener hojas de cálculo separadas.

---

## SECCIÓN 2 — Usuarios y casos de uso

**Usuario freelancer:** crea proyectos, registra horas trabajadas, genera facturas en PDF y las marca como pagadas.

**Usuario cliente (lectura):** accede mediante enlace a una factura pública, la ve y descarga el PDF.

---

## SECCIÓN 3 — Funcionalidades

**Módulo de proyectos:**
- El usuario puede crear proyectos con nombre, cliente y tarifa por hora.
- El usuario puede editar y archivar proyectos.
- El usuario puede ver el historial de horas registradas por proyecto.

**Módulo de horas:**
- El usuario puede registrar horas trabajadas con fecha, duración y descripción.
- El sistema calcula automáticamente el total acumulado del proyecto.
- El usuario puede editar o eliminar entradas de horas.

**Módulo de facturación:**
- El usuario puede crear una factura seleccionando un proyecto y un rango de fechas.
- El sistema rellena automáticamente cliente, horas y total.
- El usuario puede generar la factura en PDF.
- El usuario puede marcar una factura como pagada o pendiente.
- El sistema genera un enlace público de solo lectura por cada factura.

---

## SECCIÓN 4 — Flujos de usuario

**Flujo — Registrar horas:**
1. El usuario va al proyecto desde el dashboard.
2. Hace clic en "Añadir horas".
3. Introduce fecha, duración (en horas) y una descripción opcional.
4. El sistema guarda la entrada y actualiza el total del proyecto.
- **Error:** si la duración es 0 o negativa, el sistema muestra un mensaje "La duración debe ser mayor a 0" y no guarda la entrada.

**Flujo — Crear una factura:**
1. El usuario va a "Facturas" en el menú.
2. Hace clic en "Nueva factura".
3. Selecciona el proyecto; el sistema rellena automáticamente el cliente, las horas no facturadas y el total.
4. El usuario revisa el total y puede editarlo manualmente.
5. Hace clic en "Generar PDF".
6. El sistema produce el PDF y genera un enlace público.
- **Error:** si el proyecto no tiene horas registradas en el rango, el sistema avisa "No hay horas para facturar" y no permite generar la factura.

**Flujo — Cliente accede a factura pública:**
1. El cliente recibe un enlace por email.
2. Abre el enlace en el navegador.
3. El sistema muestra la factura en HTML y un botón "Descargar PDF".
- **Error:** si el enlace fue revocado por el freelancer, el sistema muestra "Esta factura ya no está disponible".

---

## SECCIÓN 5 — Arquitectura

- **Frontend:** Next.js (App Router) — SSR para los enlaces públicos de facturas y SEO básico.
- **Backend:** API Routes de Next.js — suficiente para v1, sin servidor separado.
- **Base de datos:** PostgreSQL en Supabase — incluye auth y storage en el mismo proveedor.
- **Autenticación:** Supabase Auth (email + Google OAuth).
- **Hosting:** Vercel para la app, Supabase para datos.
- **Generación PDF:** `@react-pdf/renderer` en el servidor.

---

## SECCIÓN 6 — Requisitos no funcionales

- **Rendimiento:** carga inicial del dashboard < 2s en conexión 4G; generación de PDF < 5s.
- **Seguridad:** cada freelancer solo ve sus propios proyectos, horas y facturas (RLS en Supabase). Los enlaces públicos de factura usan tokens UUID v4, no IDs incrementales.
- **Escalabilidad:** diseñado para hasta 500 usuarios activos en v1; PDF se genera bajo demanda, no se almacena.
- **Idioma:** español en v1, inglés en v2.
- **Accesibilidad:** formularios con labels asociados y navegación por teclado en el flujo de crear factura.
- **Compliance:** GDPR — botón de "Exportar mis datos" y "Eliminar mi cuenta" desde ajustes.

---

## Open questions

- [ ] ¿Se permiten facturas en múltiples monedas en v1, o solo EUR? — owner: Bezael, deadline: antes de empezar Módulo de facturación.

---

## Notas sobre por qué este spec funciona

- **Sección 1**: una sola oración, identifica producto + usuario + problema.
- **Sección 3**: cada bullet empieza con "El usuario puede" o "El sistema". No hay menciones a tecnología (no se habla de "componente", "tabla", "endpoint"). Eso vive en el plan.
- **Sección 4**: cada flujo tiene un error path. El flujo del cliente público pareciera no necesitar errores, pero "enlace revocado" cubre el caso real.
- **Sección 5**: stack concreto con justificación de 1 línea por decisión.
- **Sección 6**: cada NFR es **medible**. "Rápido" no es un NFR; "< 2s en 4G" sí lo es.
- **Open question** tiene owner y deadline, no queda flotando.

Este es el listón. Si tu spec se queda por debajo en alguna sección, esa sección no está terminada.
