import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hashPassword, isHashedPassword } from '../auth/password.util';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.migratePlaintextPasswords();
  }

  private async migratePlaintextPasswords() {
    const users = await this.user.findMany({
      select: { id: true, password: true },
    });

    const legacyUsers = users.filter((user) => !isHashedPassword(user.password));

    await Promise.all(
      legacyUsers.map((user) =>
        this.user.update({
          where: { id: user.id },
          data: { password: hashPassword(user.password) },
        }),
      ),
    );
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}