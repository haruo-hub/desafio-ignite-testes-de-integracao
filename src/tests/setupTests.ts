import { Connection, createConnection } from "typeorm";

let connection: Connection;
beforeAll(async () => {
  connection = await createConnection();
  await connection.runMigrations();
});

afterAll(async () => {
  await connection.dropDatabase();
  await connection.close();
});
