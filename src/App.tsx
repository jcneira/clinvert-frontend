import { useState } from "react";
import {
  Check,
  X,
  FileText,
  CalendarCheck,
  Sparkles,
  Database,
  ChevronDown,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import aiChatImg from "@/assets/ai-chat.jpg";
import phonesImg from "@/assets/phones-analytics.jpg";
import foundersImg from "@/assets/juan.jpg";

const API_URL = import.meta.env.VITE_API_URL || "https://clinvert.com/api/contacto";

// ─── Helpers ────────────────────────────────────────────────────────────────

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: "var(--card)",
        color: "var(--muted-foreground)",
        border: "1px solid var(--border)",
        padding: "6px 12px",
        borderRadius: "4px",
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function CTAButton({ children = "VER DEMO DE 15 MINUTOS", style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  const scrollToForm = () => {
    const el = document.getElementById("contacto");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <button
      onClick={scrollToForm}
      style={{
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
        fontWeight: "bold",
        letterSpacing: "0.05em",
        borderRadius: "9999px",
        padding: "16px 32px",
        fontSize: "14px",
        textTransform: "uppercase",
        boxShadow: "var(--shadow-glow)",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s",
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

// ─── Contact Form ────────────────────────────────────────────────────────────

interface FormData { nombre: string; email: string; telefono: string; mensaje: string; }
interface FormErrors { nombre?: string; email?: string; telefono?: string; mensaje?: string; }
type FormStatus = "idle" | "loading" | "success" | "error";

function validate(d: FormData): FormErrors {
  const e: FormErrors = {};
  if (!d.nombre.trim()) e.nombre = "El nombre es obligatorio.";
  if (!d.email.trim()) e.email = "El email es obligatorio.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Email inválido.";
  if (!d.telefono.trim()) e.telefono = "El teléfono es obligatorio.";
  if (!d.mensaje.trim()) e.mensaje = "Cuéntanos cómo podemos ayudarte.";
  return e;
}

function ContactForm() {
  const [form, setForm] = useState<FormData>({ nombre: "", email: "", telefono: "", mensaje: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStatus("loading");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
      // Meta Pixel — evento Lead
      if (typeof fbq !== "undefined") fbq("track", "Lead");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: "100%",
    backgroundColor: "var(--input)",
    border: `1px solid ${hasError ? "var(--destructive)" : "var(--border)"}`,
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "var(--foreground)",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <section id="contacto" style={{ padding: "96px 24px", backgroundColor: "oklch(0.19 0.025 270 / 0.4)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", scrollMarginTop: "32px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <SectionTag>HABLA CON NOSOTROS</SectionTag>
          <h2 style={{ marginTop: "32px", fontSize: "clamp(28px, 5vw, 36px)", fontWeight: "bold", lineHeight: 1.2 }}>
            Agenda Tu <span style={{ color: "var(--primary)" }}>Sesión de Crecimiento</span>
          </h2>
          <p style={{ marginTop: "16px", color: "var(--muted-foreground)" }}>
            Cuéntanos sobre tu clínica y te mostramos cómo Clinvert IA puede transformar tu proceso de ventas en menos de 10 días.
          </p>
          <div style={{ marginTop: "24px", backgroundColor: "oklch(0.82 0.13 85 / 0.08)", border: "1px solid oklch(0.82 0.13 85 / 0.4)", borderRadius: "8px", padding: "16px 20px", display: "inline-block" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--primary)", margin: 0 }}>
              🛡️ Garantía: si no agendas 5 citas nuevas en 30 días, el mes siguiente es gratis.
            </p>
          </div>
        </div>

        {status === "success" ? (
          <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--primary)", borderRadius: "16px", padding: "48px", textAlign: "center", boxShadow: "var(--shadow-glow)" }}>
            <CheckCircle2 style={{ width: 64, height: 64, color: "var(--primary)", margin: "0 auto 24px" }} />
            <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>¡Mensaje recibido!</h3>
            <p style={{ color: "var(--muted-foreground)" }}>Nos pondremos en contacto contigo en las próximas horas para coordinar tu sesión de crecimiento.</p>
            <button onClick={() => setStatus("idle")} style={{ marginTop: "32px", color: "var(--primary)", fontSize: "14px", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px", boxShadow: "var(--shadow-elegant)" }}>
            {[
              { id: "nombre", label: "Nombre completo", type: "text", placeholder: "Juan García" },
              { id: "email", label: "Correo electrónico", type: "email", placeholder: "juan@miclinica.com" },
              { id: "telefono", label: "Teléfono / WhatsApp", type: "tel", placeholder: "+57 300 000 0000" },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id} style={{ marginBottom: "24px" }}>
                <label htmlFor={id} style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
                  {label} <span style={{ color: "var(--primary)" }}>*</span>
                </label>
                <input
                  id={id} name={id} type={type}
                  value={form[id as keyof FormData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  style={inputStyle(errors[id as keyof FormErrors])}
                  onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={e => (e.target.style.borderColor = errors[id as keyof FormErrors] ? "var(--destructive)" : "var(--border)")}
                />
                {errors[id as keyof FormErrors] && (
                  <p style={{ marginTop: "6px", fontSize: "12px", color: "var(--destructive)" }}>{errors[id as keyof FormErrors]}</p>
                )}
              </div>
            ))}

            <div style={{ marginBottom: "24px" }}>
              <label htmlFor="mensaje" style={{ display: "block", fontSize: "14px", fontWeight: 500, marginBottom: "8px" }}>
                ¿Cómo podemos ayudarte? <span style={{ color: "var(--primary)" }}>*</span>
              </label>
              <textarea
                id="mensaje" name="mensaje" rows={4}
                value={form.mensaje} onChange={handleChange}
                placeholder="Cuéntanos sobre tu clínica, cuántos leads manejas al mes, qué retos tienes..."
                style={{ ...inputStyle(errors.mensaje), resize: "none" }}
                onFocus={e => (e.target.style.borderColor = "var(--primary)")}
                onBlur={e => (e.target.style.borderColor = errors.mensaje ? "var(--destructive)" : "var(--border)")}
              />
              {errors.mensaje && <p style={{ marginTop: "6px", fontSize: "12px", color: "var(--destructive)" }}>{errors.mensaje}</p>}
            </div>

            {status === "error" && (
              <div style={{ marginBottom: "24px", padding: "12px 16px", backgroundColor: "oklch(0.6 0.2 25 / 0.1)", border: "1px solid oklch(0.6 0.2 25 / 0.3)", borderRadius: "8px", fontSize: "14px", color: "var(--destructive)" }}>
                Hubo un error al enviar. Intenta de nuevo o escríbenos a <a href="mailto:info@clinvertia.com" style={{ color: "var(--destructive)" }}>info@clinvertia.com</a>
              </div>
            )}

            <button
              type="submit" disabled={status === "loading"}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                backgroundColor: status === "loading" ? "oklch(0.82 0.13 85 / 0.6)" : "var(--primary)",
                color: "var(--primary-foreground)", fontWeight: "bold", letterSpacing: "0.05em",
                borderRadius: "9999px", padding: "16px 32px", fontSize: "14px", textTransform: "uppercase",
                boxShadow: "var(--shadow-glow)", border: "none",
                cursor: status === "loading" ? "not-allowed" : "pointer", transition: "all 0.2s",
              }}
            >
              {status === "loading" ? (
                <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />Enviando...</>
              ) : (
                <><CalendarCheck style={{ width: 16, height: 16 }} />Agendar Mi Sesión Gratuita — Sin Compromiso<Send style={{ width: 16, height: 16 }} /></>
              )}
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted-foreground)", marginTop: "16px" }}>
              Sin compromiso · Te respondemos en menos de 24 horas
            </p>
          </form>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>

      {/* NAV */}
      <header style={{ display: "flex", justifyContent: "center", padding: "32px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "oklch(0.82 0.13 85 / 0.2)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "var(--primary)", fontSize: "12px", fontWeight: "bold" }}>C</span>
          </div>
          <span style={{ fontWeight: 600, letterSpacing: "0.2em", fontSize: "14px" }}>CLINVERT IA</span>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: "32px 24px 80px", textAlign: "center", backgroundImage: "var(--gradient-hero)", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "896px", margin: "0 auto" }}>
          <SectionTag>La Clínica Que Responde Primero, Gana. Clinvert IA Responde en Menos de 30 Segundos — 24/7.</SectionTag>
          <h1 style={{ marginTop: "32px", fontSize: "clamp(32px, 6vw, 60px)", fontWeight: "bold", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Responder rápido ya no es suficiente… si no conviertes tus chats en citas,{" "}
            <span style={{ color: "var(--primary)" }}>estás perdiendo dinero.</span>
          </h1>
          <p style={{ marginTop: "24px", color: "var(--muted-foreground)", maxWidth: "640px", margin: "24px auto 0", lineHeight: 1.7, fontSize: "clamp(15px, 2vw, 18px)" }}>
            Mientras tú atiendes pacientes, Clinvert envía cotizaciones, agenda citas automáticamente, responde preguntas sobre tratamientos y registra cada oportunidad en tu CRM — sin que tu equipo mueva un dedo.
          </p>
          <div style={{ marginTop: "40px" }}><CTAButton>Ver cómo funciona — Demo de 15 min</CTAButton></div>
          <p style={{ marginTop: "16px", fontSize: "14px", color: "var(--muted-foreground)" }}>
            🛡️ Garantía de 5 citas en 30 días — o el siguiente mes es gratis. Sin letra pequeña.
          </p>
          <div style={{ marginTop: "64px", maxWidth: "768px", margin: "64px auto 0", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow-elegant)", position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src="https://www.youtube.com/embed/jTSkgh1vQrw"
              title="Clinvert IA — Agente IA para clínicas estéticas que cotiza, agenda y llena tu CRM 24/7"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ padding: "96px 24px", maxWidth: "1024px", margin: "0 auto", textAlign: "center" }}>
        <SectionTag>SI TIENES UNA CLÍNICA ESTÉTICA, PROBABLEMENTE TE PASA QUE...</SectionTag>
        <h2 style={{ marginTop: "32px", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "bold", lineHeight: 1.3 }}>
          Cada minuto que tardas en responder, es un paciente que se va con tu competencia.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "56px", textAlign: "left" }}>
          <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px" }}>
            <h3 style={{ color: "var(--destructive)", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>¿Te suena familiar?</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              {["Los leads preguntan precios de noche y los respondes al día siguiente.", "Pasas horas armando cotizaciones manuales tratamiento por tratamiento.", "No tienes registro claro de quién pidió qué ni en qué etapa va.", "Tu equipo agenda mal, dobla horarios o se le escapan citas.", "Muchos contactos se pierden porque nadie hace seguimiento."].map(t => (
                <li key={t} style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                  <X style={{ width: 20, height: 20, color: "var(--destructive)", flexShrink: 0, marginTop: 2 }} /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--primary)", borderRadius: "12px", padding: "32px", boxShadow: "var(--shadow-glow)" }}>
            <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>Imagina poder...</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              {["Responder en segundos con cotizaciones personalizadas las 24 horas.", "Agendar citas directamente en tu calendario sin intervención humana.", "Resolver dudas sobre cada tratamiento con información precisa de tu clínica.", "Ver cada conversación convertida en una oportunidad activa en tu CRM."].map(t => (
                <li key={t} style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                  <Check style={{ width: 20, height: 20, color: "var(--primary)", flexShrink: 0, marginTop: 2 }} /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p style={{ marginTop: "48px", color: "var(--muted-foreground)", fontStyle: "italic" }}>¿Listo para activarlo?</p>
        <div style={{ marginTop: "16px" }}><CTAButton>Quiero esto para mi clínica</CTAButton></div>
      </section>

      {/* 4 PILARES */}
      <section style={{ padding: "96px 24px", backgroundColor: "oklch(0.19 0.025 270 / 0.4)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", textAlign: "center" }}>
          <SectionTag>UN AGENTE IA QUE HACE EL TRABAJO DE TODO TU EQUIPO COMERCIAL</SectionTag>
          <h2 style={{ marginTop: "32px", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "bold", lineHeight: 1.3, maxWidth: "768px", margin: "32px auto 0" }}>
            Cuatro Tareas Críticas, Automatizadas Por Una Sola IA Entrenada Para Tu Clínica
          </h2>
          <p style={{ marginTop: "16px", color: "var(--muted-foreground)" }}>Así reemplazamos horas de trabajo manual con segundos de respuesta inteligente</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginTop: "56px", textAlign: "left" }}>
            {[
              { Icon: FileText, title: "Envía cotizaciones al instante", desc: "Genera y manda cotizaciones personalizadas según el tratamiento que pregunte el paciente, con tus precios y condiciones reales." },
              { Icon: CalendarCheck, title: "Agenda automáticamente", desc: "Conecta con tu calendario, sugiere horarios disponibles y confirma la cita sin que nadie de tu equipo tenga que intervenir." },
              { Icon: Sparkles, title: "Informa sobre tratamientos", desc: "Responde dudas frecuentes sobre cada procedimiento, contraindicaciones, duración y postoperatorio con información validada por tu clínica." },
              { Icon: Database, title: "Crea oportunidad en tu CRM", desc: "Registra automáticamente cada lead como oportunidad con su tratamiento de interés, etapa del embudo y datos de contacto listos para cerrar." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--primary)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div style={{ width: 48, height: 48, borderRadius: "8px", backgroundColor: "oklch(0.82 0.13 85 / 0.1)", border: "1px solid oklch(0.82 0.13 85 / 0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  <Icon style={{ width: 24, height: 24, color: "var(--primary)" }} />
                </div>
                <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "18px", marginBottom: "12px" }}>{title}</h3>
                <p style={{ fontSize: "14px", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: "48px", color: "var(--muted-foreground)", fontStyle: "italic" }}>¿Listo para activarlo?</p>
          <div style={{ marginTop: "16px" }}><CTAButton>Quiero esto para mi clínica</CTAButton></div>
        </div>
      </section>

      {/* CLINVERT IA */}
      <section style={{ padding: "96px 24px", maxWidth: "1152px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <SectionTag>CONOCE A TU NUEVO AGENTE</SectionTag>
          <h2 style={{ marginTop: "32px", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "bold" }}>Clinvert IA:</h2>
          <h3 style={{ marginTop: "8px", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: "bold" }}>
            El Asistente Que Cierra Más Que Tu Equipo Humano. <span style={{ color: "var(--primary)" }}>Y Nunca Duerme</span> 🌙
          </h3>
          <p style={{ marginTop: "24px", color: "var(--muted-foreground)", maxWidth: "640px", margin: "24px auto 0" }}>
            Entrenado con tu catálogo, tus precios y tu tono. Conversa por WhatsApp, Instagram y web, y deja todo registrado en tu CRM listo para vender.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center", marginTop: "80px" }}>
          <div>
            <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "24px", marginBottom: "24px" }}>Cotiza, Resuelve y Agenda en Una Sola Conversación</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              {["Detecta el tratamiento de interés y envía la cotización en segundos.", "Explica beneficios, sesiones recomendadas y postoperatorio con datos de tu clínica.", "Propone horarios y confirma la cita directamente en tu calendario."].map(t => (
                <li key={t} style={{ display: "flex", gap: "12px" }}>
                  <Check style={{ width: 20, height: 20, color: "var(--primary)", flexShrink: 0, marginTop: 2 }} /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <img src={aiChatImg} alt="Agente IA para clínicas estéticas respondiendo cotizaciones automáticamente por WhatsApp" style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center", marginTop: "80px" }}>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <img src={phonesImg} alt="Automatización de agendamiento de citas en clínica estética con IA y CRM integrado" style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
          <div>
            <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "24px", marginBottom: "24px" }}>Cada Chat Se Convierte En Una Oportunidad Real</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              {["Crea automáticamente la oportunidad en tu CRM con tratamiento, monto y etapa.", "Asigna el lead al especialista correcto y dispara recordatorios de seguimiento.", "Te entrega el contacto creado CRM y el lead en el nivel apropiado con la información del paciente, tratamiento, agenda y costos."].map(t => (
                <li key={t} style={{ display: "flex", gap: "12px" }}>
                  <Check style={{ width: 20, height: 20, color: "var(--primary)", flexShrink: 0, marginTop: 2 }} /><span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <p style={{ color: "var(--muted-foreground)", fontStyle: "italic", marginBottom: "16px" }}>¿Listo para activarlo?</p>
          <CTAButton>Quiero esto para mi clínica</CTAButton>
        </div>
      </section>

      {/* COMPARACIÓN */}
      <section style={{ padding: "96px 24px", backgroundColor: "oklch(0.19 0.025 270 / 0.4)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", textAlign: "center" }}>
          <SectionTag>POR QUÉ SOMOS DIFERENTES</SectionTag>
          <h2 style={{ marginTop: "32px", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "bold" }}>Recepcionista Tradicional VS Clinvert IA</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "56px", textAlign: "left" }}>
            <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px" }}>
              <h3 style={{ color: "var(--destructive)", fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>Equipo Tradicional</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Responde solo en horario laboral", "Cotizaciones lentas y manuales", "Olvida hacer seguimiento", "Información inconsistente entre personas", "Dobla horarios y agenda mal", "No registra los leads en el CRM", "Costo fijo mensual elevado", "Se demora días en aprender un nuevo tratamiento", "Imposible escalar sin contratar más gente", "No genera reportes claros"].map(t => (
                  <li key={t} style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                    <X style={{ width: 20, height: 20, color: "var(--destructive)", flexShrink: 0 }} /><span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ backgroundColor: "var(--card)", border: "1px solid var(--primary)", borderRadius: "12px", padding: "32px", boxShadow: "var(--shadow-glow)" }}>
              <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>Clinvert IA</h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
                {["Responde 24/7 en segundos", "Cotiza al instante y personalizado", "Hace seguimiento automático", "Información unificada y validada", "Agenda directo en tu calendario", "Crea cada lead como oportunidad en tu CRM", "Sin sueldos ni rotación de personal", "Aprende un nuevo tratamiento en minutos", "Escala a miles de chats sin esfuerzo", "Dashboard con métricas en tiempo real"].map(t => (
                  <li key={t} style={{ display: "flex", gap: "12px", fontSize: "14px" }}>
                    <Check style={{ width: 20, height: 20, color: "var(--primary)", flexShrink: 0 }} /><span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p style={{ marginTop: "48px", color: "var(--muted-foreground)", fontStyle: "italic" }}>¿Listo para activarlo?</p>
          <div style={{ marginTop: "16px" }}><CTAButton>Actívalo en mi clínica</CTAButton></div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section style={{ padding: "96px 24px", maxWidth: "1024px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "bold", textAlign: "center", marginBottom: "56px" }}>Quiénes Somos</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center" }}>
          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <img src={foundersImg} alt="Juan Carlos - Fundador de Clinvert IA, empresa de automatización para clínicas estéticas en Colombia y LATAM" style={{ width: "100%", display: "block" }} loading="lazy" />
          </div>
          <div>
            <h3 style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "24px", marginBottom: "24px" }}>Juan Carlos — Fundador Clinvert IA</h3>
            <p style={{ fontSize: "16px", color: "var(--muted-foreground)", lineHeight: 1.8 }}>
              Construimos Clinvert IA porque vimos cómo clínicas en LATAM perdían pacientes todos los días — no por falta de calidad, sino por responder tarde. Hemos implementado el agente en clínicas que pasaron de perder el 60% de sus leads nocturnos a convertirlos en citas automáticamente. Eso es lo que hacemos.
            </p>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "48px" }}><CTAButton>Actívalo en mi clínica</CTAButton></div>
      </section>

      {/* FORMULARIO */}
      <ContactForm />

      {/* FAQ */}
      <section style={{ padding: "96px 24px", backgroundColor: "oklch(0.19 0.025 270 / 0.4)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "768px", margin: "0 auto", textAlign: "center" }}>
          <SectionTag>RESOLVEMOS TUS DUDAS</SectionTag>
          <h2 style={{ marginTop: "32px", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "bold", marginBottom: "48px" }}>Preguntas Frecuentes sobre el Agente IA para Clínicas Estéticas</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            {[
              { q: "¿Qué es Clinvert IA y cómo funciona para mi clínica estética?", a: "Clinvert IA es un agente de inteligencia artificial entrenado específicamente con los tratamientos, precios y tono de tu clínica. Responde leads por WhatsApp en segundos, envía cotizaciones personalizadas, agenda citas en tu calendario y registra cada oportunidad en tu CRM — todo de forma automática, las 24 horas." },
              { q: "¿Con qué CRMs y calendarios se integra Clinvert IA?", a: "Te entregamos nuestro propio CRM incluido en el servicio. También nos integramos con Google Calendar, Outlook y otras herramientas vía API. A futuro seguiremos expandiendo las integraciones con los CRMs más usados en el mercado." },
              { q: "¿Cómo personaliza las cotizaciones para mi clínica?", a: "Cargamos tu catálogo de tratamientos, precios, paquetes y condiciones. El agente IA arma la cotización con tu tono y la envía por el canal donde te escribió el paciente, ya sea WhatsApp, Instagram DM o formulario web." },
              { q: "¿Cuánto tiempo toma implementar el agente IA para agendamiento de citas?", a: "Entre 5 y 10 días hábiles. Nosotros nos encargamos del entrenamiento del agente, las integraciones con tu calendario y CRM, y la puesta en marcha completa. Tú no tienes que hacer nada técnico." },
              { q: "¿Clinvert IA reemplaza a mi recepcionista?", a: "No reemplaza a tu equipo — lo libera. El agente IA maneja la primera respuesta, la cotización y el agendamiento. Tu recepcionista puede enfocarse en atención presencial, casos complejos y seguimiento de calidad, en lugar de estar respondiendo WhatsApp manualmente todo el día." },
              { q: "¿Qué pasa si el paciente quiere hablar con una persona?", a: "Clinvert IA detecta cuándo el paciente necesita atención humana y transfiere la conversación a tu equipo, enviando un mensaje para que alguna persona del equipo lo contacte." },
              { q: "¿Funciona para clínicas pequeñas o solo para grandes?", a: "Funciona para cualquier clínica estética que reciba leads por WhatsApp o Instagram, sin importar el tamaño. De hecho, las clínicas pequeñas son las que más se benefician porque no tienen un equipo grande para responder rápido — y Clinvert IA les da la capacidad de respuesta de una clínica grande." },
            ].map(({ q, a }) => (
              <details key={q} className="group" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", cursor: "pointer" }}>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 500, listStyle: "none" }}>
                  <span>{q}</span>
                  <ChevronDown style={{ width: 20, height: 20, color: "var(--primary)", flexShrink: 0, transition: "transform 0.2s" }} />
                </summary>
                <p style={{ marginTop: "12px", color: "var(--muted-foreground)", fontSize: "14px", lineHeight: 1.7 }}>{a}</p>
              </details>
            ))}
          </div>
          <div style={{ marginTop: "48px" }}><CTAButton>Actívalo en mi clínica</CTAButton></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 24px", textAlign: "center", fontSize: "12px", color: "var(--muted-foreground)" }}>
        <p>Copyright © 2026 Clinvert IA | Aviso Legal | Política de Privacidad</p>
        <p style={{ marginTop: "8px" }}>info@clinvertia.com</p>
      </footer>
      {/* WHATSAPP FLOTANTE */}
      <a
        href="https://wa.me/573114911484"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37, 211, 102, 0.5)",
          zIndex: 9999,
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="32" height="32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.675 4.797 1.85 6.784L2 30l7.43-1.82A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.85-1.6l-.42-.25-4.41 1.08 1.12-4.3-.27-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.61c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.89 1.11-1.09 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.02-1.89-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.19 1.16-1.19 2.84s1.22 3.29 1.39 3.52c.17.23 2.4 3.67 5.82 5.14.81.35 1.45.56 1.94.72.82.26 1.56.22 2.15.13.66-.1 2.02-.83 2.31-1.62.28-.8.28-1.48.2-1.62-.09-.14-.32-.23-.66-.4z"/>
        </svg>
      </a>

    </div>
  );
}

export default App;
