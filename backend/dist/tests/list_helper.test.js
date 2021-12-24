"use strict";
const listHelper = require('../utils/list_helper');
const mockBlogs = require('./mock_blogs');
// This is a series of test with common possible cases, may be expanded in the future
describe('total likes', () => {
    test('empty list returns 0', () => {
        const result = listHelper.totalLikes([]);
        expect(result).toBe(0);
    });
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(mockBlogs.listWithOneBlog);
        expect(result).toBe(5);
    });
    test('A big list is correctly calculated', () => {
        const result = listHelper.totalLikes(mockBlogs.listOfBlogs);
        expect(result).toBe(36);
    });
});
describe('Max number of likes', () => {
    test('empty list returns empty object', () => {
        const result = listHelper.favoriteBlog([]);
        expect(result).toEqual({});
    });
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.favoriteBlog(mockBlogs.listWithOneBlog);
        expect(result).toBe(mockBlogs.listWithOneBlog[0]);
    });
    test('A big list is correctly calculated with the blog with the max number of likes returned', () => {
        const result = listHelper.favoriteBlog(mockBlogs.listOfBlogs);
        expect(result).toBe(mockBlogs.listOfBlogs[2]);
    });
});
describe('Authors with the most number of blogs', () => {
    test('empty list returns empty object', () => {
        const result = listHelper.mostBlogs([]);
        expect(result).toEqual({});
    });
    test('when list has only one blog, equals the author of that', () => {
        const result = listHelper.mostBlogs(mockBlogs.listWithOneBlog);
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 });
    });
    test('A big list is correctly calculated with the author with the most blogs returned alongside its number', () => {
        const result = listHelper.mostBlogs(mockBlogs.listOfBlogs);
        expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 });
    });
});
describe('Authors with the most number of likes', () => {
    test('empty list returns empty object', () => {
        const result = listHelper.mostLikes([]);
        expect(result).toEqual({});
    });
    test('when list has only one blog, equals the likes and author of that', () => {
        const result = listHelper.mostLikes(mockBlogs.listWithOneBlog);
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 });
    });
    test('A big list is correctly calculated with the author with the most likes returned alongside its number', () => {
        const result = listHelper.mostLikes(mockBlogs.listOfBlogs);
        expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
    });
});
