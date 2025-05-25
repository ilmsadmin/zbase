import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/**
 * Safely extracts user ID from request object, throwing an UnauthorizedException if not found
 * @param req Express Request object 
 * @returns User ID as a number
 */
export function getUserIdFromRequest(req: Request): number {
  // Use optional chaining and array access syntax for maximum compatibility
  const userId = req.user && req.user['id'];
  if (!userId) {
    throw new UnauthorizedException('User not authenticated');
  }
  return typeof userId === 'string' ? parseInt(userId, 10) : userId;
}

export default {
  getUserIdFromRequest,
};
