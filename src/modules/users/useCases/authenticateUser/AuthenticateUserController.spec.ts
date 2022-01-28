import request from "supertest";
import { app } from "../../../../app";

describe("Authenticate User Controller", () => {

  it("should be able to authenticate an user", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "test",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate an user with wrong email", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "test",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test1@test.com",
      password: "test",
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate an user with wrong password", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "test",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "test@test.com",
      password: "test1",
    });

    expect(response.status).toBe(401);
  });

});
