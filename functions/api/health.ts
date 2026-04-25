export const onRequestGet: PagesFunction = async () => {
  return Response.json({
    ok: true,
    service: 'bati-api',
    timestamp: new Date().toISOString()
  });
};
