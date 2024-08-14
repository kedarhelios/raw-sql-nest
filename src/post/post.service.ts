import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(id: string, createPostDto: CreatePostDto) {
    const user = await this.databaseService.query(`
      SELECT * FROM user
      WHERE id = ${id}
      LIMIT 1;
    `);

    // @ts-ignore
    if (!user.length) {
      throw new Error('User not found');
    }

    return await this.databaseService.query(`
      INSERT INTO post (title, description, user_id)
      VALUES ('${createPostDto.title}', '${createPostDto.description}', '${user[0].id}');
    `);
  }

  async findAll() {
    // await this.databaseService.query(`
    //   CREATE TABLE post (
    //   id INT AUTO_INCREMENT PRIMARY KEY,
    //   title VARCHAR(255) NOT NULL,
    //   description VARCHAR(255) NOT NULL UNIQUE,
    //   user_id INT,
    //   CONSTRAINT fk_user
    //       FOREIGN KEY (user_id)
    //       REFERENCES user(id)
    //       ON DELETE CASCADE
    //       ON UPDATE CASCADE
    //   );
    // `);

    return await this.databaseService.query(`
      SELECT JSON_OBJECT(
        'id', p.id,
        'title', p.title,
        'description', p.description,
        'user', IFNULL(
          JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ), NULL
        )
      ) AS post
      FROM post p
      LEFT JOIN user u ON p.user_id = u.id;
    `);
  }

  async findOne(id: number) {
    return await this.databaseService.query(`
      SELECT JSON_OBJECT(
        'id', p.id,
        'title', p.title,
        'description', p.description,
        'user', IFNULL(
          JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email
          ), NULL
        )
      ) AS post
      FROM post p
      LEFT JOIN user u ON p.user_id = u.id
      WHERE p.id = ${id}
      LIMIT 1;
    `);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.databaseService.query(`
      UPDATE post
      SET title = '${updatePostDto.title}', description = '${updatePostDto.description}'
      WHERE id = ${id};
    `);
  }

  async remove(id: number) {
    return await this.databaseService.query(`
      DELETE FROM post
      WHERE id = ${id};
    `);
  }
}
