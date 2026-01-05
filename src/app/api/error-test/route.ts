/**
 * Error Testing Endpoint (Development Only)
 * Test error handling and logging
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'info';

  try {
    switch (type) {
      case 'error':
        logger.error('Test error log', new Error('This is a test error'));
        throw new Error('Intentional test error');

      case 'warn':
        logger.warn('Test warning log', { test: true });
        return NextResponse.json({ message: 'Warning logged' });

      case 'info':
        logger.info('Test info log', { test: true, type: 'info' });
        return NextResponse.json({ message: 'Info logged' });

      case 'debug':
        logger.debug('Test debug log', { test: true, details: 'debug info' });
        return NextResponse.json({ message: 'Debug logged' });

      default:
        return NextResponse.json({
          message: 'Available types: error, warn, info, debug',
          example: '/api/error-test?type=error',
        });
    }
  } catch (error) {
    logger.error('Error in error-test endpoint', error);
    return NextResponse.json(
      { error: 'Error logged and thrown' },
      { status: 500 }
    );
  }
}
