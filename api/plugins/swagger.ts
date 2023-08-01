import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  fastify.register(swagger, {
    openapi: {
      info: {
        title: "Blockchain as a Service REST API",
        description: `Getting started:\n
        1. Before you proceed, it is necessary to register.\n
        2. You can authenticate the API by either using a key created through API key creation thourgh server "x-api-key" or by generating a token through web client login "x-api-token" you can choose on of these methods in the header.\n
        3. After that, you will need to register a wallet.\n
        Now you are ready to proceed with your application.`,
        version: "0.1.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
        },
        {
          url: "https://api.pchain.id",
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: "apiKey",
            name: "x-api-key",
            in: "header",
          },
          apiToken: {
            type: "apiKey",
            name: "x-api-token",
            in: "header",
          },
        },
      },
      security: [
        {
          apiKey: [],
          apiToken: [],
        },
      ],
    },
    hideUntagged: true,
  });
  fastify.register(swaggerUi);
});
