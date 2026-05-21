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
    // Meta Pixel — evento Lead 👇
    if (typeof fbq !== "undefined") fbq("track", "Lead");
  } catch {
    setStatus("error");
  }
};