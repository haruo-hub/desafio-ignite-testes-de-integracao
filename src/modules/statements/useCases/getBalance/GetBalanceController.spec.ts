import { sign } from "jsonwebtoken";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import authConfig from '../../../../config/auth';
import { User } from "../../../users/entities/User";

describe("Get Balance Controller", () => {

  it("should be able to get balance", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test Balance",
      email: "testBalance@test.com",
      password: "testBalance",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testBalance@test.com",
      password: "testBalance",
    });

    const { token } = responseToken.body;
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toBe(0);
  });

  it("should not be able to get balance with a non existent user", async () => {

    const user: User = {
      id: "bf383d0f-d4ec-4683-8ad4-8334ca3c4da3",
      name: "testNotExists",
      email: "testNotExists@test.com",
      password: "testNotExists",
      statement: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ user }, secret, {
      subject: user.id,
      expiresIn,
    });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
  });
});
