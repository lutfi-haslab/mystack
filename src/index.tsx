import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { PrismaClient, Todo } from '@prisma/client'
import { html } from '@elysiajs/html'
import * as elements from 'typed-html'

const prisma = new PrismaClient()

const app = new Elysia()
  .use(swagger())
  .use(html())
  .get("/", ({ html }) => html(
    <BaseHtml>
      <body
          class="flex w-full h-screen justify-center items-center"
          hx-get="/todos"
          hx-swap="innerHTML"
          hx-trigger="load"
        />
    </BaseHtml>
  ))
  .get("/user", async () => {
    const user = await prisma.user.findMany();
    return user
  })
  .get("/todos", async () => {
    const todo = await prisma.todo.findMany();
    return <TodoList todos={todo} />;
  })
  .post("/todo",async ({body: {content}}) => {
    const todo = await prisma.todo.create({
      data: {
        content
      }
    })

    return todo
  }, {
    body: t.Object({
      content: t.String()
    })
  })
  .get('/id/:id', ({ params: { id }, query: { name } }) => JSON.stringify({ id, name }))
  .get("/styles.css", () => Bun.file("./tailwind-gen/styles.css"))
  .listen(3008);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE BETH STACK</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`;

function TodoItem({ content, id }: Todo) {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <button
        class="text-red-500"
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        hx-target="closest div"
      >
        X
      </button>
    </div>
  );
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
}

function TodoForm() {
  return (
    <form
      class="flex flex-row space-x-3"
      hx-post="/todo"
      hx-swap="beforebegin"
      _="on submit target.reset()"
    >
      <input type="text" name="content" class="border border-black" />
      <button type="submit">Add</button>
    </form>
  );
}