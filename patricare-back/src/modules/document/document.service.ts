import { Injectable } from '@nestjs/common';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  private readonly documents = new Map<number, Document>();
  private idCounter = 1;

  constructor() {
    this.initializeDocuments();
  }

  private initializeDocuments(): void {
    this.create({
      titre: 'Bail de location appartement Paris',
      cheminFichier: '/documents/bail_001.pdf',
      userId: 1,
    });

    this.create({
      titre: 'Quittance de loyer Décembre 2024',
      cheminFichier: '/documents/quittance_001.pdf',
      userId: 3,
    });
  }

  create(documentData: Partial<Document>): Document {
    const doc = new Document(documentData);
    doc.id = this.idCounter++;
    doc.dateCreation = new Date();
    this.documents.set(doc.id, doc);
    return doc;
  }

  findAll(): Document[] {
    return [...this.documents.values()];
  }

  findOne(id: number): Document | undefined {
    return this.documents.get(id);
  }

  update(id: number, documentData: Partial<Document>): Document | undefined {
    const doc = this.documents.get(id);
    if (!doc) {
      return undefined;
    }

    Object.assign(doc, documentData);
    this.documents.set(id, doc);
    return doc;
  }

  delete(id: number): boolean {
    return this.documents.delete(id);
  }
}
