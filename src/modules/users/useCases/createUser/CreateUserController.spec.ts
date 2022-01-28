import request from "supertest";
import { app } from "../../../../app";

describe("Create User Controller", () => {

  it("should be able to create an user", async () => {

    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test@test.com",
      password: "test",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create an user if he already exists", async () => {

    await request(app).post("/api/v1/users").send({
      name: "User Test 1",
      email: "test1@test.com",
      password: "test1",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "User Test",
      email: "test1@test.com",
      password: "test1",
    });

    expect(response.status).toBe(400);
  });

});
