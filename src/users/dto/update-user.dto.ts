import { RoleType } from 'src/common/constants/roles.enum';

export class UpdateUserDto {
  username: string;
  password?: string;
  role?: RoleType;
  storage?: number; //in MB
  apps?: string[];
}
