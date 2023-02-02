"use strict";
const express = require('express');
const pick = require('../utils/pick');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    
    routes = () => {
        const router = express.Router();
        router.route('/')
            .get(this.getUsers)
            .post(this.createUser)
        router.route('/:userId')
        .get(this.getUser)
        .patch(this.updateUser)
        .delete(this.deleteUser);
        return router;
    }
    
    getUsers = async (req, res, next) => {
        try {
            const filter = pick(req.query, ['emailAddress','userName','accountNumber','identityNumber']);
            const options = pick(req.query, ['sortBy', 'limit', 'page']);
            const result = await this.userService.queryUsers(filter, options);
            return Promise.resolve(res.send(result));
        } catch (error) {
            next(error);
        }
    }

    getUser = async (req, res, next) => {
        try {
            const user = await this.userService.getUserById(req.params.userId);
            if (!user) {
                throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
            }
            Promise.resolve(res.send(user));
        } catch (error) {
            next(error);
        }
    }

    createUser = async (req, res, next) => {
        try {
            const user = await this.userService.createUser(req.body);
            console.log(user);
            Promise.resolve(res.status(httpStatus.CREATED).send(user));
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const user = await this.userService.updateUserById(req.params.userId, req.body);
            Promise.resolve(res.send(user));
        } catch (error) {
            next(error);   
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            await this.userService.deleteUserById(req.params.userId);
            Promise.resolve(res.status(httpStatus.NO_CONTENT).send());    
        } catch (error) {
            next(error);
        }
    };
}

module.exports = UserController;