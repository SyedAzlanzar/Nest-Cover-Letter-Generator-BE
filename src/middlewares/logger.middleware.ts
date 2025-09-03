import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, body, query, headers } = req;

    // 🔹 Log request as soon as it arrives
    this.logger.log(`➡️ Incoming Request: ${method} ${originalUrl}`);

    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const delay = Date.now() - start;

      // 🔹 Log when response is sent
      this.logger.log(`⬅️ Response: ${method} ${originalUrl} ${statusCode} - ${delay}ms`);
    });

    next();
  }
}
