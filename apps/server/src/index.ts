import http from "node:http";
import { createApp } from "./app";
import { connectDB, disconnectDB } from "./config/database";
import { env } from "./config/env";
import { createSocketServer } from "./socket";

let isShuttingDown = false;

const bootstrap = async (): Promise<void> => {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Nexus server listening on port ${env.PORT}`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    // eslint-disable-next-line no-console
    console.log(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      try {
        await disconnectDB();
        process.exit(0);
      } catch {
        process.exit(1);
      }
    });

    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
};

void bootstrap();
