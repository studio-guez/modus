// Liveness probe for the container healthcheck: must not depend on the CMS.
// A standalone Nitro route also skips the Nuxt app render, so a slow or
// unreachable API can never mark this container unhealthy.
export default defineEventHandler((event) => {
  setHeader(event, "Cache-Control", "no-store");
  return "ok";
});
