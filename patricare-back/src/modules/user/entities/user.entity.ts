export class User {
  id?: number;
  firstname: string;
  lastname: string;
  email?: string;
  password?: string;
  roleId?: number;
  createdAt?: Date;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

