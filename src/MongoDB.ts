import { DBInterface } from "./DB";
import { MongoClient, ObjectId } from "mongodb";

const dbName = 'user-api-tdd';

export class MongoDB implements DBInterface{
  constructor(private mongo: MongoClient) {}

  async add<T>(collection: string, record: T): Promise<T> {
    const dbCollection = this.getDbCollection(collection);
    const result = await dbCollection.insertOne(clone(record));
    const id = result.insertedId.toString();
    return Object.assign({}, record, { id });
  }
  async find<T>(collection: string, _key: string, _value: string): Promise<T> {
    try{
      const value = _key === 'id' ? new ObjectId(_value) : _value;
      const key = _key === 'id' ? '_id' : _key;
      const dbCollection = this.getDbCollection(collection);
      const result = await dbCollection.findOne<T>({ [key]: value });
      if(!result) throw new Error('Record not found');
      return result;
    }catch(e){
      throw new Error('Record not found');
    }
  }
  private getDbCollection(collection: string){
    return this.mongo.db(dbName).collection(collection);
  }
}
function clone(obj: unknown){
  return JSON.parse(JSON.stringify(obj));
}