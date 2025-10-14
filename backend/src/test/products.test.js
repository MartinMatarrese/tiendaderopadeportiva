import { fakerES as faker } from "@faker-js/faker";
import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import assert from "node:assert";

const mockProducts = () => {
    return {
        image: faker.image.url(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: "camisetas",
        status: true,
        price: 40000,
        stock: faker.number.int({min: 1, max: 50 }),
        code: faker.string.alphanumeric(6),
        thumbnail: [ faker.image.url()]
    };
};

let cookieToken = null;
const agent = request.agent(app);
let createProductId = null;
let createCategory = null;

describe("TEST API - PRODUCTS", () => {
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL);
        await mongoose.connection.collection("products").deleteMany({});
        await mongoose.connection.collection("users").deleteMany({});
        const user = {
            first_name: "Test",
            last_name: "Admin",
            email: "admin@test.com",
            age: 30,
            password: "admin123",
            role: "admin",
            fromGoogle: false
        };
        const registerRes = await agent.post("/users/register").send(user);
        const loginRes = await agent.post("/users/login").send({ email: user.email, password: user.password });
        const cookieHeader = loginRes.headers["set-cookie"] || [];
        const tokenCookie = cookieHeader.find(c => c.startsWith("token="));
        assert.ok(tokenCookie, "❌ No se encontró la cookie 'token' en el login");
        cookieToken = tokenCookie.split(";")[0];

    });

    test("[GET] /api/products - Deberia devolver todos los productos", async() => {
        const response = await agent.get("/api/products");
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body), "No se devolvio un array de productos");
    });

    test("[POST] /api/products - crear producto", async() => {
        const products = mockProducts();
        createCategory = products.category;
        const response = await agent.post("/api/products").set("Cookie", cookieToken).send(products);
        console.log("PRODUCTO CREADO: ", response.body);
                
        assert.strictEqual(response.status, 201);
        assert.strictEqual(response.body.title, products.title);
        assert.strictEqual(response.body.code, products.code);
        createProductId = response.body._id;
    });

    test("[GET] /api/products/:pid - Deberia devolver un producto por su id", async() => {
        const response = await agent.get(`/api/products/${createProductId}`);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.id, createProductId);
    });

    test("[GET] /api/products/category/:category - Deberia devolver los porductos por categoria", async() => {
        const response = await agent.get(`/api/products/category/${createCategory}`);
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body), "No devolvio un array de productos");
    });

    test("[PUT] /api/products/:pid - Actualizar producto", async() => {
        const update = { price: 45000 };
        const response = await agent.put(`/api/products/${createProductId}`).set("Cookie", cookieToken).send(update);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.price, update.price);
    });

    test("[DELETE] /api/products/:pid - Eliminar producto", async() => {
        const response = await agent.delete(`/api/products/${createProductId}`).set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.message, "Producto eliminado correctamente");
    })

    afterAll(async() => {
        await mongoose.disconnect();
    });
});