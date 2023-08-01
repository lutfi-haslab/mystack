import multer from "fastify-multer";

export const upload = multer({ storage: multer.memoryStorage() });