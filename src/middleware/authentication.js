const jwt = require('jsonwebtoken');

import { User } from '../models/user';

const authentication = async ({ req }) => {
    try {
        const {
            headers: { authorization },
        } = req;
        if (!authorization) {
            return {
                user: null,
            };
        }

        const accessToken = authorization;

        const decoded = jwt.verify(accessToken, 'hello');

        if (!decoded) {
            return {};
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
            return {};
        }

        return { user, accessToken };
    } catch (error) {
        return {};
    }
};

const subscriptionAuth = async (connectionParams) => {
    try {
        const { Authorization: authorization } = connectionParams;

        if (!authorization) {
            return {
                user: null,
            };
        }

        const accessToken = authorization.split(' ')[1];

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        if (!decoded) {
            return {};
        }

        const isExpired = await redis.get(`expiredToken:${accessToken}`);
        if (isExpired) {
            return {};
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return {};
        }

        return { user, accessToken };
    } catch (error) {
        return {};
    }
};

module.exports = { authentication, subscriptionAuth };
