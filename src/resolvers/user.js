const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

import { User } from '../models/user.js';

const { toInputObjectType } = require('graphql-compose');

const hello = {
    name: 'hello',
    type: 'User!',
    resolve: ({ context: { user } }) => user,
};

const signIn = {
    name: 'signIn',
    type: 'JSON!',
    args: {
        email: 'String!',
        password: 'String!',
    },
    resolve: async ({ args: { email, password } }) => {
        try {
            const user = await User.emailExist(email);
            if (!user) {
                return Promise.reject(new Error('User not found.'));
            }

            const comparePassword = await user.comparePassword(password);
            if (!comparePassword) {
                return Promise.reject(new Error('Password is incorrect.'));
            }

            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                },
                'hello'
            );

            return {
                token: accessToken,
            };
        } catch (error) {
            return Promise.reject(error);
        }
    },
};

const changePass = {
    name: 'changePass',
    type: 'JSON!',
    args: {
        record: 'JSON',
    },
    resolve: async ({ args, context: { user } }) => {
        try {
            let userid = user._id.toString();
            const comparePassword = await user.comparePassword(
                args.record.oldpassword
            );
            if (!comparePassword) {
                return {
                    message: 'Incorrect Password',
                };
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(args.record.newpassword, salt);
                const users = await User.updateOne(
                    { _id: userid },
                    { password: hash }
                );
                return {
                    message: 'success',
                };
            }
        } catch (error) {
            return {
                message: 'error',
            };
        }
    },
};

module.exports = {
    hello,
    signIn,
    changePass,
};
