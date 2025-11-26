import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateInitialSchema1732540800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create Ville table
        await queryRunner.createTable(new Table({
            name: "ville",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "nom",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "codePostal",
                    type: "varchar",
                    length: "10",
                },
            ],
        }), true);

        // Create Role table
        await queryRunner.createTable(new Table({
            name: "role",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "50",
                },
            ],
        }), true);

        // Create Adresse table
        await queryRunner.createTable(new Table({
            name: "adresse",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "rue",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "numero",
                    type: "integer",
                },
                {
                    name: "villeId",
                    type: "integer",
                },
            ],
        }), true);

        // Add Ville foreign key to Adresse
        await queryRunner.createForeignKey("adresse", new TableForeignKey({
            columnNames: ["villeId"],
            referencedColumnNames: ["id"],
            referencedTableName: "ville",
        }));

        // Create User table
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "nom",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "prenom",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "roleId",
                    type: "integer",
                },
            ],
        }), true);

        // Add Role foreign key to User
        await queryRunner.createForeignKey("user", new TableForeignKey({
            columnNames: ["roleId"],
            referencedColumnNames: ["id"],
            referencedTableName: "role",
        }));

        // Create Logement table
        await queryRunner.createTable(new Table({
            name: "logement",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "adresseId",
                    type: "integer",
                },
                {
                    name: "userId",
                    type: "integer",
                },
            ],
        }), true);

        // Add Adresse foreign key to Logement
        await queryRunner.createForeignKey("logement", new TableForeignKey({
            columnNames: ["adresseId"],
            referencedColumnNames: ["id"],
            referencedTableName: "adresse",
        }));

        // Add User foreign key to Logement
        await queryRunner.createForeignKey("logement", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
        }));

        // Create Documents table
        await queryRunner.createTable(new Table({
            name: "documents",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "nom",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "type",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "dateModification",
                    type: "timestamp",
                },
                {
                    name: "userId",
                    type: "integer",
                },
                {
                    name: "logementId",
                    type: "integer",
                },
            ],
        }), true);

        // Add User foreign key to Documents
        await queryRunner.createForeignKey("documents", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
        }));

        // Add Logement foreign key to Documents
        await queryRunner.createForeignKey("documents", new TableForeignKey({
            columnNames: ["logementId"],
            referencedColumnNames: ["id"],
            referencedTableName: "logement",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all tables in reverse order (drop tables with foreign keys first)
        const tables = ["documents", "logement", "user", "adresse", "role", "ville"];

        for (const table of tables) {
            // Get all foreign keys for the table
            const foreignKeys = await queryRunner.query(`
                SELECT constraint_name FROM information_schema.table_constraints 
                WHERE table_name = $1 AND constraint_type = 'FOREIGN KEY'
            `, [table]);

            // Drop all foreign keys
            for (const fk of foreignKeys) {
                await queryRunner.query(`ALTER TABLE ${table} DROP CONSTRAINT ${fk.constraint_name}`);
            }

            // Drop the table
            await queryRunner.dropTable(table, true);
        }
    }

}
