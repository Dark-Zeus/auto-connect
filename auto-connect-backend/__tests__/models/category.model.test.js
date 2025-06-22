const { createCategory } = require('../../controllers/category.controller');
const Category = require('../../models/category.model');

jest.mock('../../models/category.model'); // Mock Mongoose model

describe('createCategory controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        categoryid: 'cat001',
        name: 'Food',
        type: 'expense',
        color: '#ff0000',
        icon: 'utensils',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = { name: 'Food' }; // missing required fields

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'All required fields must be provided',
      status: 'error',
      error: 'Required fields missing',
    });
  });

  it('should return 201 if category is created successfully', async () => {
    const mockSave = jest.fn().mockResolvedValueOnce({});
    Category.mockImplementation(() => ({ save: mockSave }));

    await createCategory(req, res);

    expect(Category).toHaveBeenCalledWith(req.body);
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Category added successfully',
      category: expect.any(Object),
    });
  });

  it('should return 500 if an error occurs', async () => {
    const mockSave = jest.fn().mockRejectedValueOnce(new Error('DB Error'));
    Category.mockImplementation(() => ({ save: mockSave }));

    await createCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unknown server error',
      status: 'error',
      error: 'DB Error',
    });
  });
});
