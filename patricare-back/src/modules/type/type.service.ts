import { Injectable } from '@nestjs/common';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
    private types = new Map<number, Type>();
    private idCounter = 1;

    constructor() {
        this.initializeTypes();
    }

    private initializeTypes(): void {
        this.create({ libelle: 'Appartement' });
        this.create({ libelle: 'Maison' });
        this.create({ libelle: 'Studio' });
        this.create({ libelle: 'T2' });
        this.create({ libelle: 'T3' });
    }

    create(typeData: Partial<Type>): Type {
        const type = new Type(typeData);
        type.id = this.idCounter++;
        this.types.set(type.id, type);
        return type;
    }

    findAll(): Type[] {
        return Array.from(this.types.values());
    }

    findOne(id: number): Type | undefined {
        return this.types.get(id);
    }

    update(id: number, typeData: Partial<Type>): Type | undefined {
        const type = this.types.get(id);
        if (type) {
            Object.assign(type, typeData);
            this.types.set(id, type);
            return type;
        }
        return undefined;
    }

    delete(id: number): boolean {
        return this.types.delete(id);
    }
}