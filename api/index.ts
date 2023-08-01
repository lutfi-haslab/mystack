import cors from "@fastify/cors";
import "dotenv/config";
import Fastify from "fastify";
import { contentParser } from "fastify-multer";
import hello from "./controllers/hello";
import swagger from "./plugins/swagger";

const server = Fastify({ logger: true });

server.register(cors);
server.register(contentParser);
server.register(swagger);

server.register(hello, { prefix: "/hello" });

server.get("/ping", async (req, res) => {
  return { pong: "it worked!" };
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server listening at ${address} and port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
