const required = ['Region','Departamento','Provincia','Distrito','DNI','Nombre','Gerencia','TipoFenomeno','FechaEvento'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Método no permitido.' });
  }
  const url = process.env.POWER_AUTOMATE_URL;
  if (!url) return res.status(503).json({ success: false, message: 'Falta configurar POWER_AUTOMATE_URL.' });
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) {
    return res.status(415).json({ success: false, message: 'Se requiere JSON.' });
  }
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || JSON.stringify(body).length > 16000 || required.some(k => typeof body[k] !== 'string' || !body[k].trim())) {
    return res.status(400).json({ success: false, message: 'Campos obligatorios faltantes o solicitud demasiado grande.' });
  }
  if (!/^\d{8}$/.test(body.DNI) || !/^\d{4}-\d{2}-\d{2}$/.test(body.FechaEvento)) {
    return res.status(400).json({ success: false, message: 'DNI o fecha inválidos.' });
  }
  const safe = Object.fromEntries([...required,'Comentario'].map(k => [k, String(body[k] || '').slice(0,k==='Comentario'?2000:200)]));
  try {
    const upstream = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safe), signal: AbortSignal.timeout(25000)
    });
    if (!upstream.ok) return res.status(502).json({ success: false, message: 'Power Automate no confirmó el registro.' });
    const confirmation = await upstream.json().catch(() => null);
    if (confirmation?.success !== true) return res.status(502).json({ success: false, message: 'El flujo no confirmó el guardado.' });
    return res.status(200).json({ success: true, message: 'Reporte guardado en OneDrive.' });
  } catch {
    return res.status(502).json({ success: false, message: 'No se pudo contactar Power Automate.' });
  }
}
