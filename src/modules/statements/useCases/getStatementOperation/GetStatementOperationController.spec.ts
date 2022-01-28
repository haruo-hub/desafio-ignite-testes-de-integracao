import { sign } from "jsonwebtoken";
import request from "supertest";
import { app } from "../../../../app";
import authConfig from '../../../../config/auth';
import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";

describe("Get Statement Operation Controller", () => {

  it("should be able to get statement operation", async () => {

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
    const statementCreated = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: "10",
        description: "Description",
      })
      .set({ Authorization: `Bearer ${token}` });

    const statement: Statement = statementCreated.body;
    const response = await request(app)
      .get(`/api/v1/statements/${statement.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to get statement operation with a non existent user", async () => {

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

    const tokenUserInexistent = sign({ user }, secret, {
      subject: user.id,
      expiresIn,
    });

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
    const statementCreated = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: "10",
        description: "Description",
      })
      .set({ Authorization: `Bearer ${token}` });

    const statement: Statement = statementCreated.body;
    const response = await request(app)
      .get(`/api/v1/statements/${statement.id}`)
      .set({ Authorization: `Bearer ${tokenUserInexistent}` });
    expect(response.status).toBe(404);
  });

});
