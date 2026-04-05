type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMeta {
  [key: string]: unknown;
}

const shouldLog = (level: LogLevel): boolean => {
  if (process.env.NODE_ENV === "test" && level === "debug") {
    return false;
  }

  if (process.env.NODE_ENV === "test") {
    return false;
  }

  return true;
};

const write = (level: LogLevel, message: string, meta?: LogMeta): void => {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {})
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    // eslint-disable-next-line no-console
    console.error(line);
    return;
  }

  if (level === "warn") {
    // eslint-disable-next-line no-console
    console.warn(line);
    return;
  }

  if (level === "debug") {
    // eslint-disable-next-line no-console
    console.debug(line);
    return;
  }

  // eslint-disable-next-line no-console
  console.log(line);
};

export const logger = {
  info: (message: string, meta?: LogMeta): void => write("info", message, meta),
  warn: (message: string, meta?: LogMeta): void => write("warn", message, meta),
  error: (message: string, meta?: LogMeta): void => write("error", message, meta),
  debug: (message: string, meta?: LogMeta): void => write("debug", message, meta)
};
