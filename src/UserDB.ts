import { DBInterface } from "./DB";
import { RegistrationDetails, User } from "./models";

export interface UserDBInterface {
  addUser(user: RegistrationDetails): User;
  findUser(username: string): User;
  findUserById(id: string): User;
}

export class UserDB implements UserDBInterface{
  private collection = 'user';

  constructor(private db: DBInterface){}

  addUser(registrationDetails:User){
    return this.db.add(this.collection, registrationDetails);
  }
  findUser(username:string){
    return this.db.find(this.collection, (u:User) => u.username === username);
  }
  findUserById(id:string){
    return this.db.find(this.collection, (u:User) => u.id === id)
  }
}