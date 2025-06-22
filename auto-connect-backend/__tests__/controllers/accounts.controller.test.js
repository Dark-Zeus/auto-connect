const bankAccountController = require("../../controllers/accounts.controller");
const bankAccountService = require("../../services/accountsService");

jest.mock("../../services/accountsService");

describe("BankAccount Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // CREATE
  it("should create a bank account", async () => {
    const mockAccount = { name: "Test Account" };
    req.body = mockAccount;
    bankAccountService.createBankAccount.mockResolvedValue(mockAccount);

    await bankAccountController.createBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockAccount);
  });

  it("should handle error on createBankAccount", async () => {
    req.body = {};
    const err = new Error("Create failed");
    bankAccountService.createBankAccount.mockRejectedValue(err);

    await bankAccountController.createBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: err.message });
  });

  // READ ALL
  it("should get all bank accounts", async () => {
    const mockAccounts = [{ name: "Account 1" }];
    req.query = {};
    bankAccountService.getAllBankAccounts.mockResolvedValue(mockAccounts);

    await bankAccountController.getAllBankAccounts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAccounts);
  });

  it("should handle error on getAllBankAccounts", async () => {
    const err = new Error("Fetch failed");
    bankAccountService.getAllBankAccounts.mockRejectedValue(err);

    await bankAccountController.getAllBankAccounts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: err.message });
  });

  // READ BY ID
  it("should get bank account by ID", async () => {
    req.params = { id: "123" };
    const mockAccount = { id: "123", name: "A" };
    bankAccountService.getBankAccountById.mockResolvedValue(mockAccount);

    await bankAccountController.getBankAccountById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAccount);
  });

  it("should return 404 if bank account not found by ID", async () => {
    req.params = { id: "123" };
    bankAccountService.getBankAccountById.mockResolvedValue(null);

    await bankAccountController.getBankAccountById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Bank account not found" });
  });

  it("should handle error on getBankAccountById", async () => {
    req.params = { id: "123" };
    const err = new Error("DB error");
    bankAccountService.getBankAccountById.mockRejectedValue(err);

    await bankAccountController.getBankAccountById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: err.message });
  });

  // UPDATE
  it("should update a bank account", async () => {
    req.params = { id: "123" };
    req.body = { name: "Updated Account" };
    const updated = { id: "123", name: "Updated Account" };
    bankAccountService.updateBankAccount.mockResolvedValue(updated);

    await bankAccountController.updateBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("should return 404 on updateBankAccount if not found", async () => {
    req.params = { id: "123" };
    req.body = {};
    bankAccountService.updateBankAccount.mockResolvedValue(null);

    await bankAccountController.updateBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Bank account not found" });
  });

  it("should handle error on updateBankAccount", async () => {
    req.params = { id: "123" };
    req.body = {};
    const err = new Error("Update error");
    bankAccountService.updateBankAccount.mockRejectedValue(err);

    await bankAccountController.updateBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: err.message });
  });

  // DELETE
  it("should delete a bank account", async () => {
    req.params = { id: "123" };
    bankAccountService.deleteBankAccount.mockResolvedValue(true);

    await bankAccountController.deleteBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bank account deleted successfully",
    });
  });

  it("should return 404 on deleteBankAccount if not found", async () => {
    req.params = { id: "123" };
    bankAccountService.deleteBankAccount.mockResolvedValue(false);

    await bankAccountController.deleteBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Bank account not found" });
  });

  it("should handle error on deleteBankAccount", async () => {
    req.params = { id: "123" };
    const err = new Error("Delete error");
    bankAccountService.deleteBankAccount.mockRejectedValue(err);

    await bankAccountController.deleteBankAccount(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: err.message });
  });
});
