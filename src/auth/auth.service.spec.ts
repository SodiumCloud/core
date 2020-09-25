import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { RoleType } from '../common/constants/roles.enum';

const registeredUser: User = {
  id: 'daf2f22f2',
  storage: 124,
  apps: [],
  username: 'username',
  role: RoleType.USER,
  hash: '$2b$10$lz6crEwzWDfGfXdbHQCQ7eEsOAsIspGpC6WIIDG5LUTcCFhh5H.p.',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getOneByName: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Validate User', () => {
    it('should Validate Hash ', async () => {
      jest
        .spyOn(usersService, 'getOneByName')
        .mockResolvedValue(registeredUser);
      expect(
        await service.validateUser(registeredUser.username, 'password'),
      ).toBeTruthy();
      expect(usersService.getOneByName).toBeCalledTimes(1);
      expect(usersService.getOneByName).toBeCalledWith(registeredUser.username);
    });

    it('should reject incorrect password', async () => {
      jest
        .spyOn(usersService, 'getOneByName')
        .mockResolvedValue(registeredUser);
      expect(
        await service.validateUser(registeredUser.username, 'password-wrong'),
      ).toBeFalsy();
      expect(usersService.getOneByName).toBeCalledTimes(1);
      expect(usersService.getOneByName).toBeCalledWith(registeredUser.username);
    });

    it('should reject invalid username', async () => {
      jest.spyOn(usersService, 'getOneByName').mockResolvedValue(undefined);
      const isValid = await service.validateUser(
        registeredUser.username,
        'password',
      );

      expect(isValid).toBeFalsy();
      expect(usersService.getOneByName).toBeCalledTimes(1);
      expect(usersService.getOneByName).toBeCalledWith(registeredUser.username);
    });
  });
});
