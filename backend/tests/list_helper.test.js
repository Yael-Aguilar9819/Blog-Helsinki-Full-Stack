const listHelper = require('../utils/list_helper');
const mockBlogs = require('./mockBlogs');

// The dummy first test
test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});


// This is a series of test with common possible cases, may be expanded in the future
describe('total likes', () => {

  test('empty list returns 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(mockBlogs.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('A big list is correctly calculated', () => {
    const result = listHelper.totalLikes(mockBlogs.listOfBlogs)
    expect(result).toBe(36)
  })
})

describe('Max number of likes', () => {
  test("empty list returns 0", () => {
    const result = listHelper.favoriteBlog([])
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(mockBlogs.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('A big list is correctly calculated with the blog with the max number of likes returned', () => {
    const result = listHelper.favoriteBlog(mockBlogs.listOfBlogs)
    expect(result).toBe(36)
  })
})
