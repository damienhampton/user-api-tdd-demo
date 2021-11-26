import { v4 as uuid } from 'uuid';
import { DBInterface } from './DB';
import { UserSession } from './models';

export interface UserSessionDBInterface {
  addSession(userId: string): Promise<UserSession>;
  findSession(token: string): Promise<UserSession>;
}

export class UserSessionDB implements UserSessionDBInterface {
  private collection = 'userSession';

  constructor(private db: DBInterface){}

  async addSession(userId:string){
    return this.db.add(this.collection, { userId, token: uuid() });
  }
  async findSession(token:string){
    return this.db.find(this.collection, (s:UserSession) => s.token === token);
  }
}