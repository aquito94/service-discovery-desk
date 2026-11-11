# CLAUDE.md

## Estilo de respuesta

- Directo desde la primera palabra: sin saludos ni cierres de cortesía.
- Sin elogios a las ideas, preguntas o código del usuario.
- Sin disculpas: si hay un error, entregar el resultado corregido.
- Tono técnico y conciso.
- Cuestionar suposiciones débiles, errores lógicos e ineficiencias antes de implementar.
- Idioma: español (respuestas, commits y textos de la interfaz).

## Qué es

Portafolio consultivo de Netlife Business para partners y clientes. Sitio pre-renderizado (SSG) con TanStack Start, generado y sincronizado con Lovable. Los textos del sitio viven en `src/data/`, no en los componentes.

## Stack y versiones (según `package.json`)

- Gestor de paquetes: **Bun** (`bun.lock`, `bunfig.toml`; Netlify ejecuta `bun run build`). No hay `package-lock.json` ni `pnpm-lock.yaml` y no deben crearse.
- React `^19.2.0`, TypeScript `^5.8.3` (modo estricto).
- TanStack Start `1.168.60`, TanStack Router `1.170.41`, Router Plugin `1.168.42`, React Query `^5.101.1`.
- Vite `8.1.5` envuelto por `@lovable.dev/vite-tanstack-config` `2.26.5`; Nitro `3.0.260603-beta` (solo build).
- Tailwind CSS `^4.2.1` (vía `@tailwindcss/vite`, configuración CSS-first, sin `tailwind.config`), `tw-animate-css`.
- shadcn/ui estilo `new-york` sobre Radix UI; iconos `lucide-react`; `class-variance-authority`, `clsx`, `tailwind-merge`.
- Formularios: `react-hook-form` + `zod` `^3.25.76`. Gráficos: `recharts` `^2.15.4`. Toasts: `sonner`.
- Lint/formato: ESLint 9 (flat config) + `typescript-eslint` + Prettier 3 (`printWidth` 100, comillas dobles, punto y coma, `trailingComma: all`).
- Node: el entorno usado para verificar este archivo tenía Node 22 y Bun 1.4; la versión mínima requerida **por confirmar** (no hay `engines` ni `.nvmrc`).

## Comandos

```bash
bun install            # instalación (respeta minimumReleaseAge de 24 h en bunfig.toml)
bun run dev            # servidor de desarrollo (vite dev)
bun run build          # build de producción + pre-render de rutas → .output/
bun run build:dev      # build en modo development
bun run preview        # previsualizar el build
bun run lint           # eslint .
npx tsc --noEmit       # verificación de tipos (no hay script dedicado)
bun run format         # prettier --write . — NO ejecutar sin pedirlo (ver "Qué no tocar")
```

No hay framework de tests ni script `test`.

## Estructura de `src/`

```
src/
├── routes/                 # Rutas por archivo (TanStack). Leer src/routes/README.md
│   ├── __root.tsx          # Shell único: <head>, SiteHeader, <Outlet />, SiteFooter, Toaster, 404/errores
│   ├── index.tsx           # /
│   ├── soluciones.tsx      # layout de /soluciones
│   ├── soluciones.index.tsx
│   ├── soluciones.$slug.tsx  # detalle; loader con getSolution() y notFound()
│   ├── diagnostico.tsx, cotizador.tsx, guia.tsx
│   └── oportunidad.tsx     # formulario que llama a la server function enviarOportunidad
├── components/
│   ├── site/               # Componentes propios del sitio (SiteHeader, SiteFooter, SolutionDemo)
│   └── ui/                 # Primitivas shadcn/ui generadas
├── data/
│   ├── portfolio.ts        # Soluciones (slugs), sectores, casos, discovery, KPIs, textos comerciales
│   └── enterprise.ts       # Objetivos, capacidades, áreas, industrias, ROI, arquitectura, seguridad
├── lib/
│   ├── utils.ts            # cn()
│   ├── media.ts            # URLs de archivos en public/media
│   ├── oportunidad.functions.ts  # createServerFn: Google Sheets + Gmail vía gateway de Lovable
│   └── error-*.ts, lovable-error-reporting.ts  # captura y página de error (infraestructura)
├── hooks/use-mobile.tsx
├── assets/                 # *.asset.json de Lovable + una imagen
├── router.tsx, start.ts, server.ts  # router, middlewares (error + CSRF), wrapper SSR
├── routeTree.gen.ts        # GENERADO
└── styles.css              # Tailwind 4, tokens de tema (oklch), fuentes
```

## Convenciones

**Rutas**

- Una ruta = un archivo en `src/routes/` con `createFileRoute`. Parámetros dinámicos con `$` (`soluciones.$slug.tsx`).
- Cada ruta define `head()` con `title`, `description` y `og:*`; patrón de título: `<Página> · Netlife Business`.
- Toda ruta nueva o slug nuevo debe añadirse a `tanstackStart.pages` en `vite.config.ts`; el pre-render tiene `crawlLinks: false` y `autoStaticPathsDiscovery: false`, así que lo que no está listado no se genera.

**Componentes**

- Exports con nombre y componentes en PascalCase (`export function SiteHeader()`).
- Importar con alias `@/` (`@/components/ui/button`, `@/data/portfolio`), no con rutas relativas largas.
- Orden de imports: librerías externas, línea en blanco, imports `@/`.
- Componentes del sitio en `components/site/`. No crear componentes ad hoc si existe la primitiva en `components/ui/`.
- Para añadir una primitiva shadcn: `npx shadcn@latest add <componente>` respetando `components.json` (**por confirmar** que este sea el flujo usado; los existentes vinieron de la plantilla de Lovable).
- Contenido (textos, listas, slugs, KPIs) en `src/data/*.ts` tipado; los componentes solo lo renderizan.
- Archivos multimedia en `public/media/` y referenciados a través de `mediaUrls` en `src/lib/media.ts`, no con las URLs `/__l5e/...` de los `*.asset.json` (no funcionan fuera de Lovable).
- Código de servidor en archivos `*.functions.ts` con `createServerFn` y validación `zod`. No usar el paquete `server-only` (lo bloquea ESLint).
- Secretos solo vía `process.env["NOMBRE"]` (acceso con corchetes por `noPropertyAccessFromIndexSignature`).

**Estilos**

- Solo clases de Tailwind; combinar clases condicionales con `cn()`.
- Usar los tokens semánticos de `styles.css` (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `brand`, `brand-warm`, `ink`, `surface`, `cyan`, `chart-1..5`), nunca colores hex/oklch sueltos en componentes.
- Variantes con `cva` siguiendo el patrón de `components/ui/button.tsx`.
- Contenedor de página habitual: `mx-auto max-w-7xl px-5` (cabecera: `max-w-[90rem]`). Tipografía: Manrope.
- Diseño responsive móvil primero; la navegación de escritorio aparece en `xl:`.

## Validar un cambio antes de darlo por terminado

1. `npx tsc --noEmit` → debe terminar sin errores (hoy pasa limpio).
2. `bun run lint` → **hoy falla de base**: 171 errores (170 de `prettier/prettier` en 17 archivos + 1 `no-control-regex` en `oportunidad.functions.ts`) y 6 avisos `react-refresh`. Criterio: el cambio no agrega errores nuevos. Formatear solo los archivos tocados con `npx prettier --write <archivos>`.
3. `bun run build` → debe terminar en 0 y listar en `[prerender]` cada ruta afectada. Revisar que exista el HTML en `.output/public/<ruta>/`.
4. Cambios visuales: `bun run dev` y revisar la ruta en escritorio y en ancho móvil (~375 px).
5. Rutas nuevas: confirmar que están en `vite.config.ts` y que el `head()` tiene título y descripción.
6. No dejar `.output/` ni otros artefactos fuera de `.gitignore`.

## Qué no tocar

- `src/routeTree.gen.ts`: se genera solo.
- `vite.config.ts`: solo añadir entradas a `pages`. No agregar plugins (React, Tailwind, TanStack, tsconfig-paths, Nitro ya vienen en la configuración de Lovable; duplicarlos rompe la app).
- `src/server.ts`, `src/start.ts`, `src/lib/error-capture.ts`, `src/lib/error-page.ts`, `src/lib/lovable-error-reporting.ts`: infraestructura de errores y CSRF de Lovable.
- `.lovable/`, `src/assets/*.asset.json`: metadatos de Lovable.
- `bunfig.toml` → `minimumReleaseAgeExcludes`: no añadir excepciones sin confirmación.
- `src/components/ui/`: no editar a mano salvo necesidad justificada; preferir componer en `components/site/`.
- No crear `src/pages/`, `app/layout.tsx` ni otras convenciones de Next.js/Remix.
- No ejecutar `bun run format` sobre todo el repo: reformatea 24 archivos y ensucia el historial que sincroniza con Lovable.
- Git: no reescribir historial publicado (sin force push, rebase, amend ni squash de commits subidos); mantener la rama funcional (ver `AGENTS.md`).

## Despliegue

- Lovable publica en `https://partner-spotlight-06.lovable.app` (según `README.md`).
- `netlify.toml`: build `NITRO_PRESET=cloudflare-module bun run build`, publica `.output/public` (solo estático) con fallback SPA a `/index.html`.
- **Por confirmar**: en Netlify solo se sirven los archivos estáticos, así que la server function de `/oportunidad` no tendría servidor que la ejecute. El formulario probablemente falla ahí y solo funciona en el hosting de Lovable. Además, el fallback a `/index.html` no aplica a las rutas pre-renderizadas, que tienen su propio `index.html`.
- **Por confirmar**: variables `LOVABLE_API_KEY`, `GOOGLE_MAIL_API_KEY`, `GOOGLE_SHEETS_API_KEY`; se leen en el código, pero no está documentado dónde se configuran.

## Privacidad

No guardar en el repositorio credenciales, claves, datos personales de clientes ni contenido confidencial. Pendiente: `src/lib/oportunidad.functions.ts` tiene correos de destinatarios y el ID de una hoja de cálculo escritos en el código; moverlos a variables de entorno.
