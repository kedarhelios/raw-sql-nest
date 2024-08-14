import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: mysql.Connection;

  constructor() {
    this.initializeConnection();
  }

  async initializeConnection() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'nestjs_mysql_tutorial',
      port: 33066,
    });
  }

  async query(sql: string, params: any[] = []) {
    const [results] = await this.connection.execute(sql, params);
    return results;
  }
}
