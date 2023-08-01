import { upload } from "api/utils";
import {
  FastifyInstance,
  RouteShorthandOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import multer from "fastify-multer";

async function hello(app: FastifyInstance, options: RouteShorthandOptions) {
  app.get(
    "/",
    {
      schema: {
        tags: ["hello"],
      },
    },
    async (req: FastifyRequest, res: FastifyReply) => {
      return { hello: "world" };
    }
  );

  app.post(
    "/",
    {
      preValidation: upload.single('media'),
      schema: {
        tags: ["hello"],
        consumes: ["multipart/form-data"],
        body: {
          type: "object",
          properties: {
            data: {
              type: "string",
              examples: ["Hallo Test"],
            },
            media: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
    },
    async (req: any, res: FastifyReply) => {
      const data = (req.body as any).data as string;
      const file = (req as any).file as File;
      console.log(file);
      return { hello: data, file: JSON.stringify(file) };
    }
  );
}

export default hello;
