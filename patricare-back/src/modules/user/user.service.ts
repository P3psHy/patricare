import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private users = new Map<number, User>();
    private idCounter = 1;

    constructor() {
        this.initializeUsers();
    }

    private initializeUsers(): void {
        this.create({
            firstname: 'Jean',
            lastname: 'Dupont',
            email: 'jean.dupont@example.com',
            password: 'hashedPassword123',
            roleId: 1,
        });
        this.create({
            firstname: 'Marie',
            lastname: 'Martin',
            email: 'marie.martin@example.com',
            password: 'hashedPassword456',
            roleId: 2,
        });
        this.create({
            firstname: 'Pierre',
            lastname: 'Bernard',
            email: 'pierre.bernard@example.com',
            password: 'hashedPassword789',
            roleId: 3,
        });
    }

    create(userData: Partial<User>): User {
        const user = new User();
        user.id = this.idCounter++;
        Object.assign(user, userData);
        this.users.set(user.id, user);
        return user;
    }

    findAll(): User[] {
        return Array.from(this.users.values());
    }

    findOne(id: number): User | undefined {
        return this.users.get(id);
    }

    update(id: number, userData: Partial<User>): User | undefined {
        const user = this.users.get(id);
        if (user) {
            Object.assign(user, userData);
            this.users.set(id, user);
            return user;
        }
        return undefined;
    }

    delete(id: number): boolean {
        return this.users.delete(id);
    }
}