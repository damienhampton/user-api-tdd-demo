import { assert } from 'chai';
import { v4 as uuid } from 'uuid';
import { User, UserSession } from '../src/models';
import { UserApi, UserDB, UserSessionDB } from '../src/UserApi';

const users:User[] = [];

const fakeUserDb: UserDB = {
  addUser: (registrationDetails) => {
    const newUser = Object.assign({}, registrationDetails, { id: uuid() });
    users.push(newUser);
    return newUser;
  },
  findUser: (username) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
  findUserById: (id) => {
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },
}

const sessions:UserSession[] = [];

const fakeSessionDb: UserSessionDB = {
  addSession: (userId) => {
    const session = { userId, token: uuid() };
    sessions.push(session);
    return session;
  },
  findSession: (token) => {
    const session = sessions.find(s => s.token === token);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }
}

describe('Users', () => {
  describe('registration', () => {

    const registrationDetails = {
      username: 'username',
      password: 'password',
      about: 'about',
    }

    it('should return user details', () => {
      const newUser = (new UserApi(fakeUserDb, fakeSessionDb)).register(registrationDetails);
      
      assert.isDefined(newUser);
      assert.isString(newUser.id);
      assert.equal(newUser.username, registrationDetails.username);
    });

    it('should issue unique ids', () => {
      const userApi = new UserApi(fakeUserDb, fakeSessionDb);
      const newUser1 = userApi.register(registrationDetails);
      const newUser2 = userApi.register(registrationDetails);
    
      assert.notEqual(newUser1.id, newUser2.id);
    });
  })

  describe('login', () => {
    const username = 'username';
    const password = 'password';
    const userApi = new UserApi(fakeUserDb, fakeSessionDb);

    before(() => {
      userApi.register({ username, password, about: 'about' });
    })
    it('should log a registed user in', () => {
      const { token } = userApi.login({ username, password });
      assert.isString(token);
    })
  })

  describe('about', () => {

    describe('about user 1', () => {
      const username = 'username';
      const password = 'password';
      const about = 'about';
      const userApi = new UserApi(fakeUserDb, fakeSessionDb);

      before(() => {
        userApi.register({ username, password, about });
      })
      it('should return the about data for a user', () => {
        const { token } = userApi.login({ username, password });
        const aboutResponse = userApi.getAbout(token);
        assert.equal(aboutResponse, about);
      })
    })
    describe('about user 2', () => {
      const username = 'username2';
      const password = 'password2';
      const about = 'about2';

      const userApi = new UserApi(fakeUserDb, fakeSessionDb);

      before(() => {
        userApi.register({ username, password, about });
      })
      it('should return the about data for a different user', () => {
        
        const { token } = userApi.login({ username, password });

        const aboutResponse = userApi.getAbout(token);

        assert.equal(aboutResponse, about);
      })
    })
  })
})
