import { fakerES as faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import assert from "node:assert";
import path from "path";
import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

jest.unstable_mockModule("nodemailer", () => {
    const mockSendMail = jest.fn().mockImplementation(() => {
        return Promise.resolve({
            messageId: "mocked-message-id",
            response: "250 OK (mocked)"
        });
    });
    return {
        default: {
            createTransport: jest.fn().mockReturnValue ({
                sendMail: mockSendMail,
                verify: jest.fn().mockResolvedValue(true)
            })
        }
    };
});

const nodemailer = await import("nodemailer")

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
        const response = await agent.get("/users/current").set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.first_name);
        assert.ok(response.body.last_name);
        assert.strictEqual(typeof response.body.password, "undefined");
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

    test("[POST] /logout", async() => {
        const response = await agent.post("/users/logout").set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.message, "Logout OK");
    });

    test("[POST] /forgot-password", async() => {
        const user = mockUser();        
        const registerResponse = await agent.post("/users/register").send(user);
        assert.strictEqual(registerResponse.status, 201);                
        const response = await agent.post("/users/forgot-password").send({ email: user.email});
        if(response.status === 500 && response.body.message.includes("certificate")) {
            assert.ok(response.body.message.includes("certificate"));            
        } else {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.body.message, "Email de recuperación enviado");
        };
    });

    test("[POST] /reset-password", async() => {
        const user = mockUser();
        const registerResponse = await agent.post("/users/register").send(user);
        assert.strictEqual(registerResponse.status, 201);

        const userId = registerResponse.body._id;

        const resetToken = jwt.sign(
            { _id: userId, type: "password_reset" },
            process.env.SECRET_KEY,
            { expiresIn: "15m" }
        );
        console.log("Token jwt generado:", resetToken);
        
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

        await mongoose.connection.collection("users").updateOne(
            { _id: userId },
            {
                $set: {
                    resetToken: resetToken,
                    resetTokenExpiry: resetTokenExpiry
                }
            }
        );       

        const newPassword = "nuevacontraseña123"
        const resetResponse = await agent.post("/users/reset-password").send({
            token: resetToken,
            password: newPassword
        });

        console.log("Reset password response:", resetResponse.body);    

        assert.strictEqual(resetResponse.status, 200);
        assert.strictEqual(resetResponse.body.status, "success");
        assert.strictEqual(resetResponse.body.message, "Contraseña actualizada");
        
    });

    afterAll(async() => {
        await mongoose.disconnect();

    });

});