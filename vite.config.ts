import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { invitation } from "./src/config/invitation";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Fills the SEO / Open Graph tags in index.html from the invitation config. */
function invitationMeta(): Plugin {
  const { bride, groom, event, site } = invitation;
  const names = `${bride.name} & ${groom.name}`;
  const date = new Date(`${event.date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const base = site.url.replace(/\/$/, "");
  const ogImage = /^https?:/.test(site.ogImage) ? site.ogImage : `${base}/${site.ogImage.replace(/^\//, "")}`;
  const values: Record<string, string> = {
    TITLE: `${names} — Engagement Invitation`,
    DESCRIPTION: `You're warmly invited to celebrate the engagement ceremony of ${names}.`,
    OG_TITLE: `${names} · Engagement · ${date}`,
    OG_IMAGE: ogImage,
    SITE_URL: base || "/",
  };
  return {
    name: "invitation-meta",
    transformIndexHtml: (html) =>
      html.replace(/%%(\w+)%%/g, (m, key: string) => (key in values ? escapeHtml(values[key]) : m)),
  };
}

/** Set by the GitHub Pages workflow ("/repo-name/"); "/" everywhere else. */
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), invitationMeta()],
  server: { port: 5180 },
});
