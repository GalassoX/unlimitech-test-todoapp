import type { NextFunction, Request, Response } from 'express';

export async function logging(req: Request, res: Response, next: NextFunction): Promise<void> {
  const startTime = Date.now();

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Response Time: ${responseTime}ms`);
  });

  next();
}