const request = require('supertest');
const express = require('express');
const categoryController = require('../../controllers/category.controller');
const categoryService = require('../../services/category.service');

jest.mock('../../services/category.service'); // Correct mock path

const app = express();
app.use(express.json());

// Setup mock routes
app.post('/api/categories', categoryController.createCategory);
app.get('/api/categories', categoryController.getCategories);
app.get('/api/categories/:id', categoryController.getCategoryById);
app.put('/api/categories/:id', categoryController.updateCategory);

describe('Category Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/categories', () => {
        it('should create a category with valid data', async () => {
            const mockCategory = { categoryid: '1', name: 'Food', type: 'expense', color: '#fff', icon: '🍔' };
            categoryService.createCategory.mockResolvedValue(mockCategory);

            const res = await request(app).post('/api/categories').send(mockCategory);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Category added successfully');
            expect(res.body.category).toEqual(mockCategory);
        });

        it('should return 400 for missing fields', async () => {
            const res = await request(app).post('/api/categories').send({ name: 'Food' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Required fields missing');
        });
    });

    describe('GET /api/categories', () => {
        it('should return all categories', async () => {
            const mockCategories = [
                { categoryid: '1', name: 'Food', type: 'expense', color: '#fff', icon: '🍔' },
                { categoryid: '2', name: 'Transport', type: 'expense', color: '#000', icon: '🚗' }
            ];
            categoryService.getAllCategories.mockResolvedValue(mockCategories);

            const res = await request(app).get('/api/categories');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockCategories);
        });

        it('should handle service error and return 500', async () => {
            categoryService.getAllCategories.mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/api/categories');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Server error');
        });
    });

    describe('GET /api/categories/:id', () => {
        it('should return a category by id', async () => {
            const mockCategory = { categoryid: '1', name: 'Food', type: 'expense', color: '#fff', icon: '🍔' };
            categoryService.getCategoryById.mockResolvedValue(mockCategory);

            const res = await request(app).get('/api/categories/1');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockCategory);
        });

        it('should return 500 with custom error message if service fails', async () => {
            const error = new Error('Not found');
            error.statusCode = 500;
            categoryService.getCategoryById.mockRejectedValue(error);

            const res = await request(app).get('/api/categories/999');

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Not found');
        });

        it('should return custom status code from service error', async () => {
            const error = new Error('Category not found');
            error.statusCode = 404;
            categoryService.getCategoryById.mockRejectedValue(error);

            const res = await request(app).get('/api/categories/123');

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Category not found');
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('should update a category with valid data', async () => {
            const updatedCategory = { categoryid: '1', name: 'Updated Food', type: 'expense', color: '#eee', icon: '🍕' };
            categoryService.updateCategory.mockResolvedValue(updatedCategory);

            const res = await request(app)
                .put('/api/categories/1')
                .send(updatedCategory);

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Category updated successfully');
            expect(res.body.category).toEqual(updatedCategory);
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).put('/api/categories/1').send({ name: 'Food' });

            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Required fields are missing');
        });

        it('should return 500 with custom error message if update fails', async () => {
            const error = new Error('Update failed');
            error.statusCode = 500;
            categoryService.updateCategory.mockRejectedValue(error);

            const res = await request(app)
                .put('/api/categories/1')
                .send({ categoryid: '1', name: 'Food', type: 'expense', color: '#fff', icon: '🍔' });

            expect(res.statusCode).toBe(500);
            expect(res.body.error).toBe('Update failed');
        });

        it('should return custom status code if service error contains statusCode', async () => {
            const error = new Error('Category not found');
            error.statusCode = 404;
            categoryService.updateCategory.mockRejectedValue(error);

            const res = await request(app)
                .put('/api/categories/1')
                .send({ categoryid: '1', name: 'Food', type: 'expense', color: '#fff', icon: '🍔' });

            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Category not found');
        });
    });
});
