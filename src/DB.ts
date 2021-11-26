import { v4 as uuid } from 'uuid';

export interface DBInterface {
  add<T>(collection:string, record: T): Promise<T>,
  find<T>(collection:string, predicate: (record: T) => boolean): Promise<T>,
}

export class DB implements DBInterface {
  private db: {
    [collection:string]: any[]
  };

  constructor(){
    this.db = {};
  }
  async add<T>(collection: string, record: T): Promise<T> {
    this.ensureCollection(collection);
    const newRecord = Object.assign({}, record, { id: uuid() });
    this.db[collection].push(newRecord);
    return newRecord;
  }
  async find<T>(collection: string, predicate: (record: T) => boolean): Promise<T> {
    this.ensureCollection(collection);
    const record = this.db[collection].find(predicate);
    if (!record) {
      throw new Error('Record not found');
    }
    return record;
  }
  private ensureCollection(collection:string){
    if(!this.db[collection]){
      this.db[collection] = []
    }
  }
}