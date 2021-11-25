import { UserSession } from "./models";
import { UserSessionDBInterface } from "./UserApi";
import { v4 as uuid } from 'uuid';
import { DBInterface } from "./DB";

export class UserSessionDB implements UserSessionDBInterface {
  private collection = 'userSession';

  constructor(private db: DBInterface){}

  addSession(userId:string):UserSession {
    const session = { userId, token: uuid() };
    return this.db.add(this.collection, session);
  }
  findSession(token:string):UserSession {
    return this.db.find(this.collection, (s:UserSession) => s.token === token);
  }
}
