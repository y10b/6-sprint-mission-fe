import * as Sentry from "@sentry/nextjs";

interface ILoggerConfig {
  sendToSentry?: boolean;
  showInConsole?: boolean;
}

class Logger {
  private defaultConfig: ILoggerConfig = {
    sendToSentry: process.env.NODE_ENV === "production",
    showInConsole: process.env.NODE_ENV === "development",
  };

  error(message: string, error?: Error | unknown, config?: ILoggerConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };

    // 콘솔에 출력 (개발 환경)
    if (finalConfig.showInConsole) {
      console.error(message, error);
    }

    // Sentry로 전송 (프로덕션 환경)
    if (finalConfig.sendToSentry) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          tags: { source: "logger" },
          extra: { message },
        });
      } else {
        Sentry.captureMessage(message, "error");
      }
    }
  }

  warn(message: string, data?: unknown, config?: ILoggerConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (finalConfig.showInConsole) {
      console.warn(message, data);
    }

    if (finalConfig.sendToSentry) {
      Sentry.captureMessage(message, "warning");
    }
  }

  info(message: string, data?: unknown, config?: ILoggerConfig) {
    const finalConfig = { ...this.defaultConfig, ...config };

    if (finalConfig.showInConsole) {
      console.info(message, data);
    }

    if (finalConfig.sendToSentry) {
      Sentry.captureMessage(message, "info");
    }
  }

  // 특정 사용자 컨텍스트 설정
  setUser(userId: string, email?: string) {
    Sentry.setUser({
      id: userId,
      email: email,
    });
  }

  // 추가 컨텍스트 정보 설정
  setContext(key: string, context: Record<string, unknown>) {
    Sentry.setContext(key, context);
  }
}

export const logger = new Logger();
