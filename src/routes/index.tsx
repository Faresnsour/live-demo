import { createFileRoute } from "@tanstack/react-router";
import TryItLive from "../components/TryItLive";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Try Estanza's AI Voice Agent Live" },
      { name: "description", content: "Request a one-time live demo call from Estanza's AI voice agent." },
      { property: "og:title", content: "Try Estanza's AI Voice Agent Live" },
      { property: "og:description", content: "Request a one-time live demo call from Estanza's AI voice agent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <TryItLive />
    </main>
  );
}
