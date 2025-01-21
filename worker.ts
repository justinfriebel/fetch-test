export default {
  async fetch(request, env) {
    try {
      return await env.ASSETS.fetch(request.url);
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
