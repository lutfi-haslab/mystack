import fastify from "fastify";
import * as ejs from "ejs";
// @ts-ignore
import { html, renderToString } from "@popeindustries/lit-html-server";
import * as elements from "typed-html";

const server = fastify();

server.register(import("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
});

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

const BaseHtml = ({ children }: elements.Children) => {
  return html`
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
};

const Page = ({children}: any) => {
  return (
    <div>
      <h1>Halo Guys</h1>
      {children}
    </div>
  );
};

const Child = () => {
  return (
    <Page>
      <h1>Ini Children</h1>
    </Page>
  )
}

server.get("/ping", async (request, res) => {
  const template = <h1>Haloo guys</h1>;
  const renderedTemplate = await ejs.render(Child());
  res.type("text/html").send(renderedTemplate);
});

// server.get("/page", async (req, res) => {
//   const name = "Bob";

//   const markup = await renderToString(BaseHtml(Lists()));

//   res.header("Content-Type", "text/html; charset=utf-8");
//   return markup;
// });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
