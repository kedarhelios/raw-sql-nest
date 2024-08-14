import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(createUserDto: CreateUserDto) {
    return await this.databaseService.query(`
      INSERT INTO user (name, email, password)
      VALUES 
      ('${createUserDto.name}', '${createUserDto.email}1', '${createUserDto.password}'),
      ('${createUserDto.name}', '${createUserDto.email}2', '${createUserDto.password}'),
      ('${createUserDto.name}', '${createUserDto.email}3', '${createUserDto.password}');
    `);
  }

  async findAll() {
    // await this.databaseService.query(`
    //   CREATE TABLE user (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   name VARCHAR(255) NOT NULL,
    //   email VARCHAR(255) NOT NULL UNIQUE,
    //   password VARCHAR(255) NOT NULL
    // );
    // `);
    return await this.databaseService.query(`
      SELECT JSON_OBJECT(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'post', IFNULL(
          JSON_OBJECT(
            'id', p.id,
            'title', p.title,
            'description', p.description
          ), NULL
        )
      ) AS user
      FROM user u
      LEFT JOIN post p ON u.id = p.user_id
    `);
  }

  async findOne(id: number) {
    // const userWithPost = await this.databaseService.query(`
    //   SELECT
    //     u.id AS user_id,
    //     u.name AS user_name,
    //     u.email AS user_email,
    //     p.id AS post_id,
    //     p.title AS post_title,
    //     p.description AS post_description
    //   FROM user u
    //   LEFT JOIN post p ON u.id = p.user_id
    //   WHERE u.id = ${id}
    //   LIMIT 1;
    // `);

    // // @ts-ignore
    // if (!userWithPost.length) {
    //   throw new Error('User not found');
    // }

    // const user = {
    //   id: userWithPost[0].user_id,
    //   name: userWithPost[0].user_name,
    //   email: userWithPost[0].user_email,
    //   post: userWithPost[0].post_id
    //     ? {
    //         id: userWithPost[0].post_id,
    //         title: userWithPost[0].post_title,
    //         description: userWithPost[0].post_description,
    //       }
    //     : null, // In case there's no post associated with the user
    // };

    // return user;

    const userWithPost = await this.databaseService.query(`
      SELECT JSON_OBJECT(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'post', IFNULL(
          JSON_OBJECT(
            'id', p.id,
            'title', p.title,
            'description', p.description
          ), NULL
        )
      ) AS userWithPost
      FROM user u
      LEFT JOIN post p ON u.id = p.user_id
      WHERE u.id = ${id}
      LIMIT 1;
    `);

    console.log('userWithPost', userWithPost);

    // @ts-ignore
    if (!userWithPost.length) {
      throw new Error('User not found');
    }
    return userWithPost[0].userWithPost;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.databaseService.query(`
      UPDATE user
      SET name = '${updateUserDto.name}', email = '${updateUserDto.email}', password = '${updateUserDto.password}'
      WHERE id = ${id};
    `);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.databaseService.query(`
      DELETE FROM user
      WHERE id = ${id};
    `);
  }
}
