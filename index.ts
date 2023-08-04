import fastify from "fastify";
// @ts-ignore
import { html, renderToString } from "@popeindustries/lit-html-server";
import * as elements from "typed-html";
const server = fastify();

const data = [
  {
    id: 1,
    nama: "Lutfi",
  },
  {
    id: 2,
    nama: "Ikbal",
  },
  {
    id: 3,
    nama: "Majid",
  },
];

const ListItem = (data: { id: number; nama: string }) => {
  return html` <div class="flex flex-row space-x-3">
    <p class="text-4xl font-bold">${data.nama}</p>
    <button class="text-red-500" hx-swap="outerHTML" hx-target="closest div">
      X
    </button>
  </div>`;
};

const Lists = () => {
  return html` <div>${data.map((item) => ListItem(item))}</div>`;
};

const BaseHtml = (children: elements.Children) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>THE BETH STACK</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <link href="/styles.css" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>
    </head>

    ${children}
  </html>
`;

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get("/page", async (req, res) => {
  const name = "Bob";

  const markup = await renderToString(BaseHtml(Lists()));

  res.header("Content-Type", "text/html; charset=utf-8");
  return markup;
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
