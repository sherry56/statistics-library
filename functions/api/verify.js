const normalizeId = value => String(value ?? '').replace(/\s+/g, '');
const normalizeName = value => String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleUpperCase();

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const studentId = normalizeId(body?.studentId);
  const studentName = normalizeName(body?.studentName);
  if (!/^\d{8}$/.test(studentId) || !studentName) {
    return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }

  let roster;
  try {
    roster = JSON.parse(env.ROSTER_JSON || '[]');
  } catch {
    return Response.json({ ok: false, error: 'roster_unavailable' }, { status: 503 });
  }

  const matched = Array.isArray(roster) && roster.some(entry => {
    const [id, name] = Array.isArray(entry) ? entry : [entry?.studentId, entry?.name];
    return normalizeId(id) === studentId && normalizeName(name) === studentName;
  });
  return matched
    ? Response.json({ ok: true })
    : Response.json({ ok: false, error: 'mismatch' }, { status: 401 });
}

export function onRequestGet() {
  return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
}
