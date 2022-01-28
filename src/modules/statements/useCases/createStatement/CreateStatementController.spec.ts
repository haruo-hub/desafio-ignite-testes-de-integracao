import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import authConfig from '../../../../config/auth';
import { sign } from "jsonwebtoken";
import { User } from "../../../users/entities/User";

describe("Create Statement Controller", () => {

  it("should be able to realize a deposit", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "test",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test",
    });

    const { token } = responseToken.body;
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: "10",
        description: "Description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to realize a deposit with a non existent user", async () => {

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
      .post("/api/v1/statements/deposit")
      .send({
        amount: "10",
        description: "Description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
  });

  it("should be able to realize a withdraw", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test 2",
      email: "test2@test.com",
      password: "test2",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test2@test.com",
      password: "test2",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 10,
        description: "Deposit 10",
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 9,
        description: "Withdraw 9",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to realize a withdraw with a non existent user", async () => {

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
      .post("/api/v1/statements/withdraw")
      .send({
        amount: "10",
        description: "Description",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
  });

  it("should not be able to realize a withdraw if balance will be < 0", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test 3",
      email: "test3@test.com",
      password: "test3",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test3@test.com",
      password: "test3",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 10,
        description: "Deposit 10",
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 11,
        description: "Withdraw 11",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });
});
