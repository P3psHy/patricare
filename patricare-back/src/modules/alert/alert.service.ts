import { Injectable } from '@nestjs/common';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertService {
    private alerts = new Map<number, Alert>();
    private idCounter = 1;

    constructor() {
        this.initializeAlerts();
    }

    private initializeAlerts(): void {
        this.create({
            titre: 'Maintenance préventive appartement 123',
            description: 'Vérification plomberie et chauffage',
            userId: 1,
            typeId: 1
        });
        this.create({
            titre: 'Loyer impayé',
            description: 'Le locataire du T3 n\'a pas payé le loyer du mois',
            userId: 2,
            typeId: 2
        });
    }

    create(alertData: Partial<Alert>): Alert {
        const alert = new Alert(alertData);
        alert.id = this.idCounter++;
        alert.dateCreation = new Date();
        this.alerts.set(alert.id, alert);
        return alert;
    }

    findAll(): Alert[] {
        return Array.from(this.alerts.values());
    }

    findOne(id: number): Alert | undefined {
        return this.alerts.get(id);
    }

    update(id: number, alertData: Partial<Alert>): Alert | undefined {
        const alert = this.alerts.get(id);
        if (alert) {
            Object.assign(alert, alertData);
            this.alerts.set(id, alert);
            return alert;
        }
        return undefined;
    }

    delete(id: number): boolean {
        return this.alerts.delete(id);
    }
}