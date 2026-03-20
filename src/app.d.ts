import type { PrismaClient } from '@prisma/client';
declare global {
  namespace App {
    interface Locals {
      db: PrismaClient;
      user?: {
        id: string;
        full_name: string;
        email: string;
        role: string;
        department_id: string;
      };
    }

    interface PageData {}
    interface PageState {}
    interface Platform {}
  }
}

export {};
