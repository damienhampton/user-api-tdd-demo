import { DBInterface } from "./DB";
import { User } from "./models";
import { UserDBInterface } from "./UserApi";

export class UserDB implements UserDBInterface {
  private collection = 'user';

  constructor(private db: DBInterface){}

  addUser(registrationDetails: User):User{
    return this.db.add(this.collection, registrationDetails);
  }
  findUser(username:string):User{
    return this.db.find(this.collection, (u:User) => u.username === username);
  }
  findUserById(id:string):User{
    return this.db.find(this.collection, (u:User) => u.id === id);
  }
}