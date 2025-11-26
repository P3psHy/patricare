export class Role {
  id?: number;
  libelle: string;

  constructor(data?: Partial<Role>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
