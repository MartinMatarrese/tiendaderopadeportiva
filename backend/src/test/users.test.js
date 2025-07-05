import { fakerES as faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "node:url";

const mockUser = () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 100 }),
        password: faker.internet.password(),
        role: "user",
        fromGoogle: false
    };
};

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)

describe("TEST API - USERS", () => {
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL)
        await mongoose.connection.collection("users").drop().catch(() => {})
    })

    let userRegister = null;
    let userLogin = null;
    let cookieToken = null;
    const agent = request.agent(app);

    test("[POST] /register", async() => {
        const user = mockUser();
        const response = await request(app).post("/users/register").send(user);
        const id = response.body._id;        
        const firstNameResponse = response.body.first_name;
        const firstNameExp = user.first_name;
        const lastNameResponse = response.body.last_name;
        const lastNameExp = user.last_name;
        const emailResponse = response.body.email;
        const emailExp = user.email;
        const ageResponse = response.body.age;
        const ageExp = user.age;
        const passwordResponse = response.body.password;
        const passwordExp = user.password;        
        const statusCode = response.status;
        assert.ok(id);
        assert.strictEqual(firstNameResponse, firstNameExp);
        assert.strictEqual(lastNameResponse, lastNameExp);
        assert.strictEqual(emailResponse.toLowerCase(), emailExp.toLowerCase());
        assert.strictEqual(ageResponse, ageExp);        
        assert.strictEqual(statusCode, 201);

        userLogin = {
            email: user.email.toLowerCase(),
            password: user.password
        };

        const isPasswordValid = await bcrypt.compare(passwordExp, passwordResponse);
        assert.strictEqual(emailResponse.toLowerCase(), emailExp.toLowerCase());
        assert.strictEqual(isPasswordValid, true);
    });

    test("[POST] /login", async() => {
        const response = await agent.post("/users/login").send(userLogin)
        const setCookieHeader = response.headers["set-cookie"];        
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.token);
        assert.strictEqual(response.body.message, "Login Ok");
        assert.ok(setCookieHeader);
        assert.strictEqual(setCookieHeader.some(cookie => cookie.startsWith("token=")), true);
        cookieToken = setCookieHeader.find(cookie => cookie.startsWith("token=")).split(";")[0];
    });

    test("[GET] /current", async() => {
        const response = await agent.get("/users/current").send(userLogin);
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.user.first_name);
        assert.ok(response.body.user.last_name);
        assert.ok(response.body.user.age);
        assert.strictEqual(typeof response.body.user.password, "undefined");
    });

    test("[POST] /profile-pic", async() => {
        const imagePath = path.join(_dirname, "assets", "profile.jpg");
        const response = await agent.post("/users/profile-pic").set("Cookie", cookieToken).attach("profilePic", imagePath);
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.message);
    });

    test("[GET] /google", async() => {
        const response = await request(app).get("/users/google");
        assert.strictEqual(response.status, 302);
        assert.ok(response.headers["location"].includes("accounts.google.com"));
    });

    test("[GET] /logout", async() => {
        const response = await agent.get("/users/logout").set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.message, "Logout OK");
    });

    afterAll(async() => {
        await mongoose.disconnect();
    });

});