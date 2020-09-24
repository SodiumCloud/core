import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

//prettier-ignore
{//Register
var Ruser1: RegisterUserDto = {username: 'username1', password: 'password1', email: 'email@email.com',};
var Ruser2: RegisterUserDto = {username: undefined,   password: 'password2', email: 'email@email.com',};
var Ruser3: RegisterUserDto = {username: 'username1', password: undefined,   email: 'email@email.com',};
var Ruser4: RegisterUserDto = {username: 'username4', password: 'password4', email: undefined,};
//Login
var Luser1: LoginUserDto = {username: 'username1', password: 'password1', };
var Luser2: LoginUserDto = {username: undefined,   password: 'password2', };
var Luser3: LoginUserDto = {username: 'username1', password: undefined , };
var Luser4: LoginUserDto = {username: 'username4', password: 'wrong',};
}

describe('AUTH Register (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register  user (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(Ruser1)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user.username).toBe(Ruser1.username);
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBe(Ruser1.email);
      })
      .expect(HttpStatus.CREATED);
  });

  it('/auth/register No Duplicates (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(Ruser1)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user.username).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBeUndefined();
        expect(body.message).toBe('Username is not avialable');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/register Username Required (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(Ruser2)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user.username).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBeUndefined();
        expect(body.message).toBe('Username is Required');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/register Password Required (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(Ruser3)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user.username).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBeUndefined();
        expect(body.message).toBe('Password is Required');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/auth/register Email is NOT Required (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(Ruser4)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user.username).toBe(Ruser4.username);
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBe(Ruser4.email);
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
});

describe('AUTH Login (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/auth/login user (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send(Luser1)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeDefined();
        expect(body.token).toBe(
          /Bearer\s[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}/,
        );
        expect(body.user.email).toBeUndefined();
      })
      .expect(HttpStatus.OK);
  });

  it('/api/auth/login username required (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send(Luser2)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBeUndefined();
        expect(body.message).toBeDefined();
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/api/auth/login user password required (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send(Luser3)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBeUndefined();
        expect(body.message).toBeDefined();
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/api/auth/login reject wrong credintails required (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send(Luser4)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body.user).toBeUndefined();
        expect(body.user.password).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.token).toBeUndefined();
        expect(body.user.email).toBeUndefined();
        expect(body.message).toBeDefined();
      })
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
