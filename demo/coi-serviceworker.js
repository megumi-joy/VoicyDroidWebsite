/*! coi-serviceworker v0.1.7 - MIT License - https://github.com/gzguidoti/coi-serviceworker */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
            return;
        }

        event.respondWith(
            fetch(event.request).then((response) => {
                if (response.status === 0) {
                    return response;
                }

                const newHeaders = new Headers(response.headers);
                newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders,
                });
            })
        );
    });
} else {
    const script = document.currentScript;
    const coep = script.hasAttribute("data-coep") ? script.getAttribute("data-coep") : "require-corp";
    const coop = script.hasAttribute("data-coop") ? script.getAttribute("data-coop") : "same-origin";

    if (window.crossOriginIsolated === false) {
        navigator.serviceWorker.register(window.location.href, { scope: "./" }).then((registration) => {
            registration.addEventListener("updatefound", () => {
                location.reload();
            });

            if (registration.active) {
                location.reload();
            }
        });
    }
}
