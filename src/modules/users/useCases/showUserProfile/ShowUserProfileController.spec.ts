import request from "supertest";
import { app } from "../../../../app";
import { User } from "../../entities/User";
import { sign } from "jsonwebtoken";
import authConfig from '../../../../config/auth';

describe("Show User Profile Controller", () => {

  it("should be able to show an user profile", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test Profile",
      email: "testProfile@test.com",
      password: "testProfile",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testProfile@test.com",
      password: "testProfile",
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to show an user profile with a non existent user", async () => {

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

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${tokenUserInexistent}` });
    expect(response.status).toBe(404);
  });

});
