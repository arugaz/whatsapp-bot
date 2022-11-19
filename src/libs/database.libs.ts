import { PrismaClient, Session } from '@prisma/client';

export default class Database extends PrismaClient {
  constructor() {
    super({
      errorFormat: 'pretty',
    });
  }
  public createSession = async (sessionId: string): Promise<Session> =>
    await this.session.create({
      data: { sessionId: sessionId },
    });
  public getSession = async (sessionId: string): Promise<Session | null> =>
    await this.session.findUnique({
      where: { sessionId },
    });
  public updateSession = async (sessionId: string, session: string): Promise<Session> =>
    await this.session.update({
      where: { sessionId: sessionId },
      data: { session: session },
    });
  public deleteSession = async (sessionId: string): Promise<Session> =>
    await this.session.delete({
      where: { sessionId },
    });
}
