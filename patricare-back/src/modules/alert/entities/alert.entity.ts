export class Alert {
    id?: number;
    titre: string;
    description?: string;
    dateCreation?: Date;
    userId?: number;
    typeId?: number;

    constructor(data?: Partial<Alert>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
