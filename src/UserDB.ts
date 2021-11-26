import { DBInterface } from "./DB";
import { RegistrationDetails, User } from "./models";

export interface UserDBInterface {
  addUser(user: RegistrationDetails): Promise<User>;
  findUser(username: string): Promise<User>;
  findUserById(id: string): Promise<User>;
}

export class UserDB implements UserDBInterface{
  private collection = 'user';

  constructor(private db: DBInterface){}

  async addUser(registrationDetails:User){
    return this.db.add(this.collection, registrationDetails);
  }
  async findUser(username:string){
    return this.db.find<User>(this.collection, 'username', username);
  }
  async findUserById(id:string){
    return this.db.find<User>(this.collection, 'id', id)
  }
}