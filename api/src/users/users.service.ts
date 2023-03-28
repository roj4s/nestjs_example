import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';
import { Model } from 'moongose';
import { IUser } from './users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './model/User';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly http: HttpService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  public create(user: IUser) {
    new this.userModel(user).save();
    return user;
  }

  public findAll(): Observable<Promise<Array<IUser>>> {
    return this.http
      .get('https://reqres.in/api/users')
      .pipe(map((res) => res.data.data))
      .pipe(
        map(async (users: Array<IUser>) => {
          users.forEach(async (user: IUser) => {
            new this.userModel(user).save();
          });

          return users;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  public find(id): Observable<Promise<IUser>> {
    return this.http
      .get(`https://reqres.in/api/users/${id}`)
      .pipe(map((res) => res.data.data))
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
  }

  public async findAvatar(id) {
    const userDb = await this.userModel.find({ id }).catch((err) => {
      console.log(err);
    });

    if (!userDb) {
      return new ForbiddenException('User not found');
    }

    if (userDb.avatarBlob) {
      console.log('returning avatar blob from db');
      return userDb.avatarBlob;
    }

    const getAvatar = this.http
      .get(`https://reqres.in/api/users/${id}`)
      .pipe(
        map((res) => res.data.data),
        map((user: IUser) => {
          return user.avatar;
        }),
      )
      .pipe(
        map((avatarUrl) => {
          return this.http.get(avatarUrl).pipe(
            map((avatarResp) => {
              const data = Buffer.from(avatarResp.data, 'binary').toString(
                'base64',
              );
              userDb.avatarBlob = data;
              userDb.save();
              console.log(userDb.avatarBlob);
              return data;
            }),
          );
        }),
      );

    return getAvatar;
  }

  public async deleteAvatar(id) {
    const userDb = await this.userModel.find({ id }).catch((err) => {
      console.log(err);
    });

    if (!userDb) {
      return new ForbiddenException('User not found');
    }

    userDb.avatarBlob = '';
    userDb.save();
  }
}
