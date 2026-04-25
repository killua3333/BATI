type QuizResultPayload = {
  archetypeId: string;
  scoreVector: Record<string, number>;
  createdAt?: string;
};

export const onRequestPost: PagesFunction<{ BATI_DB: D1Database }> = async (context) => {
  const { BATI_DB } = context.env;

  if (!BATI_DB) {
    return Response.json({ ok: false, message: 'D1 binding BATI_DB is missing.' }, { status: 500 });
  }

  let payload: QuizResultPayload;
  try {
    payload = (await context.request.json()) as QuizResultPayload;
  } catch {
    return Response.json({ ok: false, message: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (!payload?.archetypeId || !payload?.scoreVector) {
    return Response.json({ ok: false, message: 'archetypeId and scoreVector are required.' }, { status: 400 });
  }

  const createdAt = payload.createdAt ?? new Date().toISOString();

  await BATI_DB.prepare(
    `INSERT INTO quiz_results (archetype_id, score_vector, created_at) VALUES (?1, ?2, ?3)`
  )
    .bind(payload.archetypeId, JSON.stringify(payload.scoreVector), createdAt)
    .run();

  return Response.json({ ok: true });
};

export const onRequestGet: PagesFunction<{ BATI_DB: D1Database }> = async (context) => {
  const { BATI_DB } = context.env;

  if (!BATI_DB) {
    return Response.json({ ok: false, message: 'D1 binding BATI_DB is missing.' }, { status: 500 });
  }

  const { results } = await BATI_DB.prepare(
    `SELECT id, archetype_id, score_vector, created_at FROM quiz_results ORDER BY id DESC LIMIT 50`
  ).all<{
    id: number;
    archetype_id: string;
    score_vector: string;
    created_at: string;
  }>();

  return Response.json({
    ok: true,
    items: (results ?? []).map((row) => ({
      id: row.id,
      archetypeId: row.archetype_id,
      scoreVector: JSON.parse(row.score_vector),
      createdAt: row.created_at
    }))
  });
};
