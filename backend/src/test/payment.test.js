import { fakerES as faker } from "@faker-js/faker";
import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import assert from "node:assert";
import productModel from "../daos/mongodb/models/product.model.js";
import jwt from "jsonwebtoken";
import cartModel from "../daos/mongodb/models/cart.model.js";
import { jest } from "@jest/globals";
import { transporter } from "../config/gmail.config.js";
import { cartServices } from "../services/cart.service.js";

const agent = request.agent(app);
let cookieToken = null;
let productId = null;
let userId = null;
let cartId = null;
let paymentId = null;

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

const mockPayment = () => {
    return {
        _id: "64fa4f6d8bca0d5e4f1a1d23",
        paymentId: "123456789",
        userId: "64fa4f6d8bca0d5e4f1a1aaa",
        status:"approved",
        amount: 10000,
        cartId: "64fa4f6d8bca0d5e4f1a1ccc",
        ticketId: "64fa4f6d8bca0d5e4f1a1eee",
        createdAt: new Date().toISOString()
    };
};

describe("TEST API - PAYMENT", () => {
    beforeAll(async() =>{
        await mongoose.connect(process.env.MONGO_URL);
        await mongoose.connection.collection("products").deleteMany({});
        await mongoose.connection.collection("users").deleteMany({});
        await mongoose.connection.collection("carts").deleteMany({});

        const user = mockUser();
        await agent.post("/users/register").send(user);
        const loginRes = await agent.post("/users/login").send({
            email: user.email,
            password: user.password
        }); 
        const cookieHeader = loginRes.headers["set-cookie"] || [];
        const tokenCookie = cookieHeader.find(c => c.startsWith("token="));
        cookieToken = tokenCookie?.split(";")[0];
        const token = cookieToken.split("=")[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        userId = decoded._id
        const product = mockProducts();
        const productRes = await productModel.create(product);
        productId = productRes._id;
        const cartRes = await agent.post("/api/carts").set("Cookie", cookieToken);
        cartId = cartRes.body._id;
        const payment = mockPayment();
        const paymentRes = await agent.post("/api/payments").set("Cookie", cookieToken).send(payment);
        paymentId = paymentRes.body.id;
    });

    test("[POST] /api/payments/create-preference -  Debería crear la preferencia de pago", async() => {
        await agent.post(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken).send({ quantity: 1 });
        const updateCart = await cartModel.findById(cartId).populate("products.id_prod")
        cartId = updateCart._id        
        const response = await agent.post("/api/payments/create-preference").set("Cookie", cookieToken).send({ userId, cartId });
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.init_point, "No se recibio el init_point de la preferencia");
    });

    test("[GET] /api/payments/success - Debería devolver el resumen del pago", async() => {
        jest.spyOn(transporter, "sendMail").mockResolvedValue({ accepted: ["admin@gmail.com"]});
        const res = await agent.post("/api/payments").set("Cookie", cookieToken).send(mockPayment());
        const createPayment = res.body;        
        paymentId = createPayment.id || createPayment._id;

        const response =  await agent.get(`/api/payments/success?paymentId=${paymentId}&status=approved&userId=${userId}&cartId=${cartId}`).set("Cookie", cookieToken);
        
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.ticket, "Debe devolver un ticket");        
        assert.ok(response.body.ticket.id || response.body._id, "Debe devolver el ticket con id");       
    });

    test("[GET] /api/payments - Debería devolver todos los pagos del usuario", async() => {
        const response = await agent.get("/api/payments").set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body), "Debe devolver un array de pagos");
        assert.ok(Array.isArray(response.body), true);
    });

    test("[GET] /api/payments/:paymentid - Debería devolver el pago por id", async() => {
        console.log("paymentId desde response.body.payment.id", paymentId);
        
        const response = await agent.get(`/api/payments/${paymentId}`).set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.id, "Debe devolver el pago con id");
        assert.strictEqual(response.body.id, paymentId);
    });

    test("[POST] /api/payments - Debería crear el pago", async() => {
        await agent.post(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken).send({ quantity: 1 });
        const resultado = await cartServices.purchaseCart(cartId);
        const { ticket } = resultado
        const paymentData = {
            paymentId: "123456789",
            userId,
            cartId,
            status: "approved",
            amount: ticket.amount,
            ticketId: ticket._id?.toString()
        };
        const response = await agent.post("/api/payments").set("Cookie", cookieToken).send(paymentData)
        assert.strictEqual(response.status, 201);
        assert.ok(response.body._id, "No se creo el pago correctamente");
        assert.strictEqual(response.body.userId, userId);
        assert.strictEqual(response.body.status, "approved");
    });

    test("[PUT] /api/payments/:paymentid - Debería actualizar el estado del pago correctamente", async() => {
        await agent.post(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken).send({ quantity: 1 })
        const paymentRes = await agent.post("/api/payments/create-preference").set("Cookie", cookieToken).send({ userId, cartId });
        const {id: paymentId} = paymentRes.body;
        const response = await agent.put(`/api/payments/${paymentId}`).set("Cookie", cookieToken).send({ status: "approved" });
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.message, "Pago actualizado");
    });

    test("[DELETE] /api/payments/:paymentid - Debería elminar el pago", async() => {
        await agent.post(`/api/carts/${cartId}/products/${productId}`).set("Cookie", cookieToken).send({ quantity: 1 })
        const paymentRes = await agent.post("/api/payments/create-preference").set("Cookie", cookieToken).send({ userId, cartId });
        const {id: paymentId} = paymentRes.body
        const response = await agent.delete(`/api/payments/${paymentId}`).set("Cookie", cookieToken);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.message, "Pago eliminado con éxito")
    });

    afterAll(async() => {
        await mongoose.disconnect();
    });
});