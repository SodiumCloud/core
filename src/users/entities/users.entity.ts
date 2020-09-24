import { Entity, PrimaryColumn, Column, Generated } from 'typeorm';
import { RoleType } from '../../common/constants/roles.enum';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn()
  username: string;

  @Column()
  @Generated('uuid')
  id: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @Column({ type: 'simple-enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column()
  storage: number; //in MB

  @Column('simple-array')
  apps: string[];
}
