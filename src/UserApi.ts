import { RegistrationDetails, UserResponse, LoginDetails, LoginResponse } from "./models";
import { UserDBInterface } from "./UserDB";
import { UserSessionDBInterface } from "./UserSessionDB";

export class UserApi{
  constructor(private userDb: UserDBInterface, private sessionDb: UserSessionDBInterface) {}

  public async register(registrationDetails: RegistrationDetails): Promise<UserResponse> {
    const newUser = await this.userDb.addUser(registrationDetails);
    return {
      id: newUser.id,
      username: newUser.username,
    }
  }

  public async login(loginDetails: LoginDetails): Promise<LoginResponse> {
    const user = await this.userDb.findUser(loginDetails.username);
    if(user.password !== loginDetails.password){
      throw new Error('Invalid password');
    }
    const session = this.sessionDb.addSession(user.id);
    return session;
  }

  public async getAbout(token: string): Promise<string> {
    const session = await this.sessionDb.findSession(token);
    const user = await this.userDb.findUserById(session.userId);
    return user.about;
  }
}