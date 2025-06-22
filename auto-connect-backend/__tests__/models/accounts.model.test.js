const mongoose = require("mongoose");
const BankAccount = require("../../models/bankAccount.model");

describe("BankAccount Model", () => {
  it("should throw validation error if required fields are missing", async () => {
    const bankAccount = new BankAccount(); // Missing all required fields
    let err;

    try {
      await bankAccount.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.bankName).toBeDefined();
    expect(err.errors.branchName).toBeDefined();
    expect(err.errors.accountNumber).toBeDefined();
    expect(err.errors.cardNumber).toBeDefined();
    expect(err.errors.accountType).toBeDefined();
  });

  it("should create bank account successfully with valid data", async () => {
    const validBankAccount = new BankAccount({
      userId: new mongoose.Types.ObjectId(),
      bankName: "BOC (Bank of Ceylon)",
      branchName: "Colombo Main",
      accountNumber: "1234567890",
      cardNumber: "1234-5678-9012-3456",
      accountType: "Savings",
    });

    let error;
    try {
      await validBankAccount.validate();
    } catch (err) {
      error = err;
    }

    expect(error).toBeUndefined(); // Should pass validation
    expect(validBankAccount.status).toBe("Active");
    expect(validBankAccount.balance).toBe(0);
  });

  it("should fail if invalid enum values are used", async () => {
    const invalidBankAccount = new BankAccount({
      userId: new mongoose.Types.ObjectId(),
      bankName: "Fake Bank",
      branchName: "Nowhere",
      accountNumber: "0000000000",
      cardNumber: "1111-2222-3333-4444",
      accountType: "Ghost Account",
    });

    let err;
    try {
      await invalidBankAccount.validate();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.bankName).toBeDefined();
    expect(err.errors.accountType).toBeDefined();
  });
});
