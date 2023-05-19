import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaExclude } from 'prisma-exclude';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  exclude = prismaExclude(this);

  //
  // exclude<Key extends keyof any>(data: any, keys: Key[]) {
  //   console.log(data);
  //   return prismaExclude<any>(this)(data, keys);
  // }
  // Exclude users
  excludeUser() {
    return this.exclude('users' as any, ['password', 'created_at']);
  }
  // Exclude keys with data
  manualExclude<T, Key extends keyof T>(data: T, keys: Key[]): Omit<T, Key> {
    for (const key of keys) {
      delete data[key];
    }
    return data;
  }
}
