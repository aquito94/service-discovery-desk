import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Info } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { enterpriseCapabilities } from "@/data/enterprise";

export const Route = createFileRoute("/cotizador")({
  head: () => ({
    meta: [
      { title: "Estimador de impacto estratégico · Netlife Business" },
      {
        name: "description",
        content:
          "Evalúe los beneficios estratégicos de cada capacidad para su organización, en lenguaje de alta dirección y sin cifras.",
      },
      { property: "og:title", content: "Estimador de impacto estratégico · Netlife Business" },
      {
        property: "og:description",
        content: "Beneficios por rol directivo para construir su caso de negocio con Netlife Business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Estimador,
});

const priorities = [
  { id: "crecimiento", label: "Acelerar el crecimiento de ingresos", benefit: "Mayor velocidad comercial y protección de cada oportunidad en los momentos que definen la compra." },
  { id: "eficiencia", label: "Ganar eficiencia operativa", benefit: "Capacidad liberada en los equipos al eliminar reprocesos, traspasos manuales y tareas sin valor." },
  { id: "experiencia", label: "Elevar la experiencia del cliente", benefit: "Una relación consistente en todos los canales, con historial y continuidad en cada interacción." },
  { id: "control", label: "Fortalecer gobierno y control", benefit: "Visibilidad de punta a punta, trazabilidad y alertas antes de que una desviación llegue al cierre." },
  { id: "escala", label: "Escalar sin crecer linealmente", benefit: "Una operación que absorbe mayor volumen sin depender de incorporar estructura en la misma proporción." },
  { id: "decision", label: "Decidir con información confiable", benefit: "Una sola versión de la verdad para priorizar, anticipar escenarios y actuar con evidencia." },
];

const scopes = ["Comercial", "Marketing", "Servicio", "Operaciones", "Finanzas", "Tecnología", "Talento Humano", "Gerencia General"];

const roleImpact: Record<string, { role: string; text: string }> = {
  ceo: { role: "CEO / Gerencia General", text: "Una organización más ágil, conectada y preparada para crecer, con visibilidad integral para conducir la estrategia." },
  cfo: { role: "Finanzas (CFO)", text: "Mejor uso de la capacidad instalada, menos costos ocultos por errores y un caso de negocio medible desde el inicio." },
  coo: { role: "Operaciones (COO)", text: "Procesos fluidos entre áreas, menores tiempos de ciclo y control sobre los puntos críticos de la operación." },
  cro: { role: "Comercial (CRO)", text: "Respuesta oportuna, seguimiento disciplinado y más oportunidades que avanzan hasta el cierre." },
  cto: { role: "Tecnología (CTO)", text: "Un ecosistema integrado y gobernado que aprovecha la tecnología existente y reduce la deuda operativa." },
  cx: { role: "Experiencia del Cliente", text: "Clientes que no repiten su historia, atención consistente y relaciones que se fortalecen en el tiempo." },
};

function Estimador() {
  const [picked, setPicked] = useState<string[]>(["eficiencia", "experiencia"]);
  const [areas, setAreas] = useState<string[]>(["Comercial", "Operaciones"]);
  const [caps, setCaps] = useState<string[]>(["conversacional", "orquestacion"]);

  const tog = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    set((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const selectedPriorities = priorities.filter((p) => picked.includes(p.id));
  const selectedCaps = enterpriseCapabilities.filter((c) => caps.includes(c.id));

  const memo = useMemo(
    () => `Memo ejecutivo · Netlife Business
Prioridades estratégicas: ${selectedPriorities.map((p) => p.label).join("; ") || "Por definir"}
Áreas involucradas: ${areas.join(", ") || "Por definir"}
Capacidades a evaluar: ${selectedCaps.map((c) => c.title).join(", ") || "Por definir"}

Beneficios esperados:
${selectedPriorities.map((p) => `• ${p.benefit}`).join("\n")}

Siguiente paso: sesión de diagnóstico con un asesor Netlife Business para definir alcance, línea base y caso de negocio.`,
    [selectedPriorities, areas, selectedCaps],
  );

  const chip = (active: boolean) =>
    `rounded-lg border p-4 text-left text-sm transition-colors ${
      active ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/40"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs tracking-widest text-primary uppercase">Estimador de impacto estratégico</p>
      <h1 className="mt-3 text-4xl font-normal sm:text-5xl">El valor se mide en decisiones, no en licencias.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Defina sus prioridades y descubra los beneficios que cada capacidad puede aportar a su organización,
        expresados desde la perspectiva de cada miembro del comité directivo.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-8 border-border/70 bg-surface/70 p-6">
          <section>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">1 · Prioridades estratégicas</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {priorities.map((p) => (
                <button key={p.id} type="button" onClick={() => tog(setPicked)(p.id)} className={chip(picked.includes(p.id))}>
                  <span className="font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </section>
          <section>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">2 · Áreas involucradas</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {scopes.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => tog(setAreas)(a)}
                  className={`rounded-full border px-4 py-1.5 text-sm ${areas.includes(a) ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </section>
          <section>
            <p className="text-xs tracking-widest text-muted-foreground uppercase">3 · Capacidades a evaluar</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {enterpriseCapabilities.map((c) => (
                <button key={c.id} type="button" onClick={() => tog(setCaps)(c.id)} className={chip(caps.includes(c.id))}>
                  <span className="font-medium">{c.title}</span>
                </button>
              ))}
            </div>
          </section>
        </Card>

        <div className="space-y-5">
          <Card className="border-primary/30 bg-primary/5 p-6">
            <p className="text-xs tracking-widest text-primary uppercase">Beneficios esperados</p>
            <ul className="mt-4 space-y-3">
              {selectedPriorities.length === 0 && (
                <li className="text-sm text-muted-foreground">Seleccione al menos una prioridad estratégica.</li>
              )}
              {selectedPriorities.map((p) => (
                <li key={p.id} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{p.benefit}</span>
                </li>
              ))}
            </ul>
            {selectedCaps.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
                {selectedCaps.map((c) => (
                  <p key={c.id} className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{c.title}:</span> {c.statement ?? c.description}
                  </p>
                ))}
              </div>
            )}
          </Card>

          <Card className="border-border/70 bg-surface/70 p-6">
            <p className="text-xs tracking-widest text-muted-foreground uppercase">Impacto por rol directivo</p>
            <div className="mt-4 space-y-4">
              {Object.values(roleImpact).map((r) => (
                <div key={r.role}>
                  <p className="text-sm font-medium">{r.role}</p>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border/70 bg-surface/70 p-6">
            <div className="flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/10 p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm">
                <span className="font-semibold">El alcance y la inversión se definen con su asesor.</span>{" "}
                Cada propuesta parte de un diagnóstico de sus procesos y de un caso de negocio propio.
              </p>
            </div>
            <Button className="mt-4 w-full" variant="outline" onClick={() => navigator.clipboard?.writeText(memo)}>
              Copiar memo ejecutivo
            </Button>
            <Button asChild className="mt-2 w-full">
              <Link to="/oportunidad">Agendar sesión de diagnóstico</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
