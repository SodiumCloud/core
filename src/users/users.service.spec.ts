import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { RoleType } from '../common/constants/roles.enum';
import { Repository } from 'typeorm';

let usersArray: User[] = [
  {
    id: 'adfafa29939293',
    username: 'username1',
    role: RoleType.ADMIN,
    hash: 'adfafda',
    storage: 123,
    apps: ['add', 'dadfa', 'adfafd'],
  },
  {
    id: 'adfa9d92929',
    username: 'username3',
    role: RoleType.USER,
    hash: 'diafafasfs',
    storage: 2123,
    apps: [, 'dadfa', 'adfafd'],
  },
];

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(usersArray),
            findOneOrFail: jest.fn().mockResolvedValue(usersArray[1]),
            save: jest.fn(),
            create: jest.fn().mockReturnValue(usersArray[1]),
            update: jest.fn().mockReturnValue(true),
            delete: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAll', async () => {
    const users = await service.getAll();
    expect(users).toEqual(usersArray);
  });

  it('getOneById', async () => {
    const repoSpy = jest.spyOn(repo, 'findOneOrFail');
    const user = await service.getOneById('121323dsafasdfjak');
    expect(user).toEqual(usersArray[1]);
    expect(repoSpy).toBeCalledWith({ id: '121323dsafasdfjak' });
  });

  it('getOneByName', async () => {
    const repoSpy = jest.spyOn(repo, 'findOneOrFail');
    const user = await service.getOneByName('username1');
    expect(user).toEqual(usersArray[1]);
    expect(repoSpy).toBeCalledWith({ username: 'username1' });
  });

  it('insertOne', async () => {
    const user = await service.insertOne({
      username: 'hi',
      password: '12',
      email: 'a@a.com',
    });
    expect(repo.save).toBeCalledTimes(1);
    expect(user).toEqual(usersArray[1]);
    expect(repo.save).toBeCalledWith(usersArray[1]);
  });

  it('updateOne', async () => {
    let user = usersArray[1];
    user.storage = 1;
    let newuser = await service.updateOne(user);
    expect(repo.update).toBeCalledTimes(1);
    expect(repo.update).toBeCalledWith({ username: user.username }, user);
    expect(newuser).toEqual(user);
  });

  describe('deleteOne', () => {
    it('should delete with {deleted: true}', async () => {
      let response = await service.deleteOne(usersArray[0].username);
      expect(repo.delete).toBeCalledTimes(1);
      expect(repo.delete).toBeCalledWith({ username: usersArray[0].username });
      expect(response).toEqual({
        deleted: true,
        message: 'deleted successfully',
        username: usersArray[0].username,
      });
    });
    it('should not delete non exisant users', async () => {
      let repoSpy = jest.spyOn(repo, 'delete').mockRejectedValue({
        deleted: false,
        message: "username doesn't exist",
        username: usersArray[0].username,
      });
      let response = await service.deleteOne(usersArray[0].username);
      expect(response).toEqual({
        deleted: false,
        message: "username doesn't exist",
        username: usersArray[0].username,
      });
      expect(repoSpy).toBeCalledTimes(1);
      expect(repoSpy).toBeCalledWith({ username: usersArray[0].username });
    });
  });
});
