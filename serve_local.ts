import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PORT = 8080;

serve(async (req) => {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = `.${path}`;

    try {
        const content = await Deno.readFile(filePath);
        const contentType = getContentType(path);

        return new Response(content, {
            headers: {
                "content-type": contentType,
                "Cross-Origin-Embedder-Policy": "require-corp",
                "Cross-Origin-Opener-Policy": "same-origin",
            },
        });
    } catch (e) {
        return new Response("Not Found", { status: 404 });
    }
}, { port: PORT });

function getContentType(path: string): string {
    if (path.endsWith(".html")) return "text/html";
    if (path.endsWith(".js")) return "application/javascript";
    if (path.endsWith(".wasm")) return "application/wasm";
    if (path.endsWith(".pck")) return "application/octet-stream";
    return "text/plain";
}
