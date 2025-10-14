import { fakerES as faker } from "@faker-js/faker";
import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import assert from "node:assert";
import productModel from "../daos/mongodb/models/product.model.js";
import { transporter } from "../config/gmail.config.js";
import { jest } from "@jest/globals";


let cookieToken = null;
let productId = null;
let cartId = null;
let userId = null;
const agent = request.agent(app);

const mockUser = () => {
    return {
        _id: new mongoose.Types.ObjectId(),
        first_name: "Test",
        last_name: "Admin",
        email: "admin@gmail.com",
        age: 30,
        password: "admin123",
        role: "user",
    };
};

const mockProducts = () => {
    return {
        _id: new mongoose.Types.ObjectId(),
        image: faker.image.url(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: "camisetas",
        status: true,
        price: 40000,
        stock: faker.number.int({min: 1, max: 50 }),
        code: faker.string.alphanumeric(6),
        thumbnail: [ faker.image.url() ]
    };
};

describe("TEST API - CARTS", () => {
    beforeAll(async() => {
        await mongoose.connect(process.env.MONGO_URL);
        await mongoose.connection.collection("products").deleteMany({});
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("carts").deleteMany({});

        const user = mockUser();
        await agent.post("/users/register").send(user);

        const loginRes = await agent.post("/users/login").send({
            email: user.email,
            password: user.password,
        });
        userId = loginRes._id;

        const cookieHeader = loginRes.headers["set-cookie"] || [];
        const tokenCookie = cookieHeader.find(c => c.startsWith("token="));
        cookieToken = tokenCookie.split(";")[0];
        const product = mockProducts();        
        const productRes = await productModel.create(product);        
        productId = productRes._id;
        const cartRes = await agent.post("/api/carts").set("Cookie", cookieToken);
        cartId = cartRes.body._id;
    });

    test("[POST] /api/carts - Debería crear el carrito", async() => {
            const response = await agent.post("/api/carts").set("Cookie", cookieToken)
            assert.strictEqual(response.status, 201);
            cartId = response.body._id;
            assert.ok(cartId, "No se recibio el id del carrito");
        });
        
    test("[GET] /api/carts/:cid - Debería devolver el carrito", async() => {
        const response = await agent.get(`/api/carts/${cartId}`).set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.products), "Carrito no encontrado");
    });

    test("[POST] /api/carts/:cid/products/:pid - Debería insertar un producto en el carrito", async() => {        
        const response = await agent.post(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken);        
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.products), "El carrito no existe");
    });

    test("[PUT] /api/carts/:cid - Debería actualizar el carrito", async() => {
        const products = [{id_prod: productId, quantity: 5}];        
        const response = await agent.put(`/api/carts/${cartId}`).set("Cookie", cookieToken).send({ products });        
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.products), "El carrito no existe");
    });

    test("[PUT] /api/carts/:cid/products/:pid - Debería actualizar un producto en el carrito", async() =>{
        const response = await agent.put(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken).send({ quantity: 3 });
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.products), "El producto no existe");
    });

    test("[POST] /api/carts/:cid/purchase - Debería devolver el resumen de la compra", async() => {
        jest.spyOn(transporter, "sendMail").mockResolvedValue({ accepted: ["admin@gmail.com"]});        
        const response = await agent.post(`/api/carts/${cartId}/purchase`).set("Cookie", cookieToken);        
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.result.ticket);
        assert.ok(Array.isArray(response.body.result.productsOutStock));
    });

    test("[DELETE] /api/carts/:cid/products/:pid - Debería eliminar un producto del carrito", async() => {
        const response = await agent.delete(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken)
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.products), "El producto no existe");
    });

    test("[DELETE] /api/carts/:cid - Deberia eliminar el carrito", async() => {
        const response = await agent.delete(`/api/carts/${cartId}`).set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body.products), "Carrito eliminado correctamente");
    });

    afterAll(async() => {
        await mongoose.disconnect();
    });
});