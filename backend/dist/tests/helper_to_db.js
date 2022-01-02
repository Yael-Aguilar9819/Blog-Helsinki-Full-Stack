"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require('bcrypt');
// const Blog = require('../models/blog');
// const User = require('../models/user');
const blog_1 = __importDefault(require("../models/blog"));
const user_1 = __importDefault(require("../models/user"));
const listOfBlogsToDB = [
    {
        title: 'Typescript patterns',
        author: 'Michael Chan',
        url: 'https://Typescriptpatterns.com/',
        likes: 3,
    },
    {
        title: 'Learning to test',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/learning-to-test.html',
        likes: 5,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 3,
    },
    {
        title: 'Programming Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Programming-Considered-Harmful.html',
        likes: 9,
    },
];
const blogWithAllProperties = {
    title: 'New Blog 232',
    author: 'Josh cracker',
    url: 'www.idontknow.com',
    likes: 13,
};
const blogWithoutLikes = {
    title: 'New Article',
    author: 'Nyan-kun',
    url: 'www.TopCat2001.com',
};
const blogwithoutUrl = {
    title: 'Covid is no more',
    author: 'Mr. T',
    likes: 5,
};
const blogWithoutTitle = {
    author: 'Super blogger',
    url: 'www.blogsnainai.com',
    likes: 1,
};
// So it's less cumebrsome to access all of the blogs currently in the remote DB
const blogsInRemoteDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blog_1.default.find({});
    // Returns an array of blogs
    return blogs.map(blog => blog.toJSON());
});
const getRandomBlog = () => __awaiter(void 0, void 0, void 0, function* () {
    const arrayOfBlogs = yield blogsInRemoteDB();
    const randomBlogIndex = Math.floor(Math.random() * arrayOfBlogs.length);
    return arrayOfBlogs[randomBlogIndex];
});
const ObjectsHaveDifferentValuesOrCats = (baseObject, objectToCompare) => {
    let isThereADifference = false;
    Object.keys(baseObject).forEach(property => {
        if (objectToCompare[property] !== baseObject[property]) {
            // little bit of a hack, but this means that this category won't be checked
            // because it's going to change it's name
            if (property === 'userId') {
                return;
            }
            isThereADifference = true;
        }
    });
    return isThereADifference;
};
const usersInRemoteDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    // Returns an array of users with all it's characteristics
    return users.map(user => user.toJSON());
});
const getRandomUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const arrayOfUsers = yield usersInRemoteDB();
    const randomUserIndex = Math.floor(Math.random() * arrayOfUsers.length);
    return arrayOfUsers[randomUserIndex];
});
const hashListOfUsers = (listOfUsers) => __awaiter(void 0, void 0, void 0, function* () {
    // This hash the password with the number of salt rounds
    // How it works: https://github.com/kelektiv/node.bcrypt.js#readme
    const saltRounds = 10;
    // the .map gets resolved in parallel through Promise.all
    const hashedUsers = yield Promise.all(listOfUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const passwordHash = yield bcrypt.hash(user.password, saltRounds);
        // This will deep copy the object so now it's a separated one
        const userToModify = JSON.parse(JSON.stringify(user));
        userToModify.passwordHash = passwordHash;
        delete userToModify.password;
        return userToModify;
    })));
    // The new array of modified objects it's returned after all the objects are processed
    return hashedUsers;
});
const listOfUsersToDB = [
    {
        username: 'The typescriper',
        name: 'No one has this name',
        password: 'welp i dont have an idea',
    },
    {
        username: 'the javaGod',
        name: 'Many names here',
        password: 'some well done pass',
    },
    {
        username: 'Patterns of conquest',
        name: 'may be unique',
        password: 'well thought pass',
    },
];
// This shows the different users to be used in various parts of the test
const userWithAllProperties = {
    username: 'user-root-test',
    name: 'Well made test user',
    password: 'pass not so safe',
};
const userWithoutUsername = {
    name: 'not so well made test user',
    password: 'pass necessary',
};
const userWithoutNameParameter = {
    username: 'original username',
    password: 'pass not so safe',
};
const userWithoutPasswordParameter = {
    username: 'pass without username nor name',
    name: 'name given totally correct',
};
/* eslint-disable no-param-reassign */
// it's necessary to add the parameter of ID to add it to the blog
const getArrayOfInitialBlogPromises = userID => {
    const blogWithUserAdded = listOfBlogsToDB.map(blog => {
        blog.user = userID;
        return blog;
    });
    const blogsToAdd = blogWithUserAdded.map(blog => new blog_1.default(blog));
    const promiseArrayOfBlogs = blogsToAdd.map(blog => blog.save());
    return promiseArrayOfBlogs;
};
/* eslint-enable no-param-reassign */
// this time it's necessary to make it async
// Because it modifies the same parameter each time
const addBlogsToUser = (userID, arrayOfBlogsReturned) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(userID);
    user.blogs = user.blogs.concat(arrayOfBlogsReturned.map(blog => blog._id));
    yield user.save();
});
// This will find the blog if it's in the userInfo
const findBlogInUserPortionByID = (blogID, userInfo) => {
    const result = userInfo.blogs.some(blog => {
        if (blog.id === blogID) {
            return blog;
        }
    });
    return result;
};
module.exports = {
    listOfBlogsToDB,
    blogWithAllProperties,
    blogWithoutLikes,
    blogwithoutUrl,
    blogWithoutTitle,
    blogsInRemoteDB,
    getRandomBlog,
    ObjectsHaveDifferentValuesOrCats,
    usersInRemoteDB,
    getRandomUser,
    hashListOfUsers,
    listOfUsersToDB,
    userWithAllProperties,
    userWithoutUsername,
    userWithoutNameParameter,
    userWithoutPasswordParameter,
    getArrayOfInitialBlogPromises,
    addBlogsToUser,
    findBlogInUserPortionByID,
};
