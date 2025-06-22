const mongoose = require('mongoose');
const Category = require('../../models/category.model');
const categoryService = require('../../services/category.service');

jest.mock('../../models/category.model'); // mock the Mongoose model

describe('Category Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategory', () => {
        it('should create and return a new category', async () => {
            const inputData = { categoryid: '1', name: 'Food', type: 'expense', color: '#fff', icon: '🍔' };
            const mockSavedCategory = { ...inputData }; // mock saved category
            const mockSave = jest.fn().mockResolvedValue(mockSavedCategory); // mock save method

            // Mock Category to return an object with save()
            Category.mockImplementation(() => ({
                save: mockSave
            }));

            const result = await categoryService.createCategory(inputData);

            // Test if Category is called with the correct data
            expect(Category).toHaveBeenCalledWith(inputData);
            expect(mockSave).toHaveBeenCalled(); // check if save was called
            expect(result).toEqual(mockSavedCategory); // check if the result is correct
        });
    });

    describe('getAllCategories', () => {
        it('should return all categories', async () => {
            const categories = [{ name: 'Food' }, { name: 'Transport' }];
            Category.find.mockResolvedValue(categories);

            const result = await categoryService.getAllCategories();

            expect(Category.find).toHaveBeenCalled();
            expect(result).toEqual(categories);
        });
    });

    describe('getCategoryById', () => {
        it('should throw error for invalid ID format', async () => {
            const invalidId = '123';

            await expect(categoryService.getCategoryById(invalidId))
                .rejects
                .toThrow('Invalid ID format');
        });

        it('should throw error if category not found', async () => {
            const validId = new mongoose.Types.ObjectId().toString();
            Category.findById.mockResolvedValue(null);

            await expect(categoryService.getCategoryById(validId))
                .rejects
                .toThrow('Category not found');
        });

        it('should return category for valid ID', async () => {
            const validId = new mongoose.Types.ObjectId().toString();
            const mockCategory = { _id: validId, name: 'Food' };
            Category.findById.mockResolvedValue(mockCategory);

            const result = await categoryService.getCategoryById(validId);

            expect(Category.findById).toHaveBeenCalledWith(validId);
            expect(result).toEqual(mockCategory);
        });
    });

    describe('updateCategory', () => {
        it('should throw error for invalid ID format', async () => {
            const invalidId = '123';
            await expect(categoryService.updateCategory(invalidId, {}))
                .rejects
                .toThrow('Invalid ID format');
        });

        it('should throw error if category not found', async () => {
            const validId = new mongoose.Types.ObjectId().toString();
            Category.findByIdAndUpdate.mockResolvedValue(null);

            await expect(categoryService.updateCategory(validId, {}))
                .rejects
                .toThrow('Category not found');
        });

        it('should update and return category', async () => {
            const validId = new mongoose.Types.ObjectId().toString();
            const updateData = { name: 'Updated', categoryid: '1', type: 'expense', color: '#000', icon: '🛒' };
            const updatedCategory = { _id: validId, ...updateData };

            Category.findByIdAndUpdate.mockResolvedValue(updatedCategory);

            const result = await categoryService.updateCategory(validId, updateData);

            expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
                validId,
                updateData,
                { new: true, runValidators: true }
            );
            expect(result).toEqual(updatedCategory);
        });
    });
});
