import { assert } from 'chai';
import { UserApi } from '../src/UserApi';
import { DB } from '../src/DB';
import { UserDB } from '../src/UserDB';
import { UserSessionDB } from '../src/UserSessionDB';

const fakeDb = new DB();

const userDb = new UserDB(fakeDb);
const sessionDb = new UserSessionDB(fakeDb);

describe('Users', () => {
  describe('registration', () => {

    const registrationDetails = {
      username: 'username',
      password: 'password',
      about: 'about',
    }

    it('should return user details', async () => {
      const newUser = await (new UserApi(userDb, sessionDb)).register(registrationDetails);
      
      assert.isDefined(newUser);
      assert.isString(newUser.id);
      assert.equal(newUser.username, registrationDetails.username);
    });

    it('should issue unique ids', async () => {
      const userApi = new UserApi(userDb, sessionDb);
      const newUser1 = await userApi.register(registrationDetails);
      const newUser2 = await userApi.register(registrationDetails);
    
      assert.notEqual(newUser1.id, newUser2.id);
    });
  })

  describe('login', () => {
    const username = 'username';
    const password = 'password';
    const userApi = new UserApi(userDb, sessionDb);

    before(() => {
      userApi.register({ username, password, about: 'about' });
    })
    it('should log a registed user in', async () => {
      const { token } = await userApi.login({ username, password });
      assert.isString(token);
    })
  })

  describe('about', () => {

    describe('about user 1', () => {
      const username = 'username';
      const password = 'password';
      const about = 'about';
      const userApi = new UserApi(userDb, sessionDb);

      before(() => {
        userApi.register({ username, password, about });
      })
      it('should return the about data for a user', async () => {
        const { token } = await userApi.login({ username, password });
        const aboutResponse = await userApi.getAbout(token);
        assert.equal(aboutResponse, about);
      })
    })
    describe('about user 2', () => {
      const username = 'username2';
      const password = 'password2';
      const about = 'about2';

      const userApi = new UserApi(userDb, sessionDb);

      before(() => {
        userApi.register({ username, password, about });
      })
      it('should return the about data for a different user', async () => {
        
        const { token } = await userApi.login({ username, password });

        const aboutResponse = await userApi.getAbout(token);

        assert.equal(aboutResponse, about);
      })
    })
  })
})
