import { RegistrationDetails, User, UserSession, UserResponse, LoginDetails, LoginResponse } from "./models";

export interface UserDBInterface {
  addUser(user: RegistrationDetails): User;
  findUser(username: string): User;
  findUserById(id: string): User;
}

export interface UserSessionDBInterface {
  addSession(userId: string): UserSession;
  findSession(token: string): UserSession;
}

export class UserApi{
  constructor(private userDb: UserDBInterface, private sessionDb: UserSessionDBInterface) {}

  public register(registrationDetails: RegistrationDetails): UserResponse {
    const newUser = this.userDb.addUser(registrationDetails);
    return {
      id: newUser.id,
      username: newUser.username,
    }
  }

  public login(loginDetails: LoginDetails): LoginResponse {
    const user = this.userDb.findUser(loginDetails.username);
    if(user.password !== loginDetails.password){
      throw new Error('Invalid password');
    }
    const session = this.sessionDb.addSession(user.id);
    return session;
  }

  public getAbout(token: string): string {
    const session = this.sessionDb.findSession(token);
    const user = this.userDb.findUserById(session.userId);
    return user.about;
  }
}