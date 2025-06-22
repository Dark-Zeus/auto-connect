const request = require("supertest");
const express = require("express");
const accountsRouter = require("../../routes/accounts.routes");

// Mock the controller
jest.mock("../../controllers/accounts.controller", () => ({
  createBankAccount: (req, res) =>
    res.status(201).json({ message: "Account created" }),
  getAllBankAccounts: (req, res) =>
    res.status(200).json([{ id: 1, name: "Test Account" }]),
  getBankAccountById: (req, res) => res.status(200).json({ id: req.params.id }),
  updateBankAccount: (req, res) =>
    res.status(200).json({ id: req.params.id, ...req.body }),
  deleteBankAccount: (req, res) =>
    res.status(200).json({ message: "Account deleted" }),
}));

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use("/api/accounts", accountsRouter);

// Test suite
describe("Bank Account Routes", () => {
  it("should create a bank account", async () => {
    const res = await request(app)
      .post("/api/accounts/add-account")
      .send({ name: "My Account", balance: 1000 });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Account created");
  });

  it("should get all bank accounts", async () => {
    const res = await request(app).get("/api/accounts");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe("Test Account");
  });

  it("should get a single bank account by ID", async () => {
    const res = await request(app).get("/api/accounts/123");

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("123");
  });

  it("should update a bank account", async () => {
    const res = await request(app)
      .put("/api/accounts/456")
      .send({ name: "Updated Account" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Account");
    expect(res.body.id).toBe("456");
  });

  it("should delete a bank account", async () => {
    const res = await request(app).delete("/api/accounts/789");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Account deleted");
  });
});
