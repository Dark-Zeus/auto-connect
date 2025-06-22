const request = require('supertest');
const express = require('express');
const categoryRoutes = require('../../routes/category.route');
const categoryController = require('../../controllers/category.controller');

// Create a mock Express app for testing routes
const app = express();
app.use(express.json());
app.use('/categories', categoryRoutes);

// Mock the controller methods
jest.mock('../../controllers/category.controller');

describe('Category Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('POST /categories - should call createCategory', async () => {
        categoryController.createCategory.mockImplementation((req, res) => {
            res.status(201).json({ message: 'Category created' });
        });

        const res = await request(app)
            .post('/categories')
            .send({ name: 'Test Category' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ message: 'Category created' });
        expect(categoryController.createCategory).toHaveBeenCalled();
    });

    test('GET /categories - should call getCategories', async () => {
        categoryController.getCategories.mockImplementation((req, res) => {
            res.status(200).json([{ id: 1, name: 'Sample' }]);
        });

        const res = await request(app).get('/categories');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ id: 1, name: 'Sample' }]);
        expect(categoryController.getCategories).toHaveBeenCalled();
    });

    test('GET /categories/:id - should call getCategoryById', async () => {
        categoryController.getCategoryById.mockImplementation((req, res) => {
            res.status(200).json({ id: req.params.id, name: 'Sample' });
        });

        const res = await request(app).get('/categories/123');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ id: '123', name: 'Sample' });
        expect(categoryController.getCategoryById).toHaveBeenCalled();
    });

    test('PUT /categories/:id - should call updateCategory', async () => {
        categoryController.updateCategory.mockImplementation((req, res) => {
            res.status(200).json({ message: 'Category updated' });
        });

        const res = await request(app)
            .put('/categories/123')
            .send({ name: 'Updated Category' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Category updated' });
        expect(categoryController.updateCategory).toHaveBeenCalled();
    });
});
