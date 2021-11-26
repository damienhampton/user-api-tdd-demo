import { assert } from "chai";
import { DB } from "../src/DB";
import { MongoDB } from "../src/MongoDB";
import { MongoClient } from "mongodb";

type TestData = {
  id: string,
  value: string
}

const dbs = [
  {
    name: 'In-memory DB',
    create: async () => new DB(),
  },
  {
    name: 'Mongo DB',
    create: async () => {
      const mongo = new MongoClient("mongodb://localhost:27017/");
      await mongo.connect();
      
      return new MongoDB(mongo);
    },
    destory: () => {}
  }
]

dbs.map(dbFactory => {
  describe(dbFactory.name, () => {
    describe('add', () => {
      describe('record exists', () => {
        const value = 'cat';
        
        it('should add a record and find it again', async () => {
          const db = await dbFactory.create();
          const result = await db.add('test', { value, id: '' });
          const record = await db.find<TestData>('test', 'id', result.id);
          assert.equal(record.value, value);
        })
      })
      describe('record does not exist', () => {
        const value = 'cat';
        
        it('should throw error as record doesn\'t exist', async () => {
          const db = await dbFactory.create()
          try{
            await db.find<TestData>('test', 'id', 'xxx');
            assert.fail();
          }catch(_e){
            const e = _e as Error;
            assert.equal(e.message, 'Record not found');
          }
        })
      })
    })
  })
})
