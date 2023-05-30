import express from "express";
import User, { IUser } from "../Models/Users";

import bcrypt from 'bcryptjs';
import { sign } from "jsonwebtoken"
import auth from "../Middleware/Index";
import Article from "../Models/Article";

const router = express.Router();
router.post("/signup", async (req, res) => {
    const {
        fullname,
        email,
        password
    } = req.body;
    try {
        if (!fullname || !email || !password) return res.status(400).send('fields Missing!');

        const isEmail = await User.findOne({
            email
        }).lean();
        if (isEmail) return res.status(400).send('Email already taken!');

        const hashedPWD = await bcrypt.hash(password, 12);
        if (!hashedPWD) return res.status(500).send('Something went wrong!');

        const newUser = await User.create({
            fullname,
            email,
            password: hashedPWD
        })
        if (newUser && newUser._id) {
            const token = sign({
                id: newUser._id
            }, "MY-PRIVATE_KEY", {
                expiresIn: 360000
            });
            const payload = {
                token,
                user: newUser
            }
            return res.status(200).json(payload);
        } else {
            throw Error("Something Went Wrong")
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong!');
    }

})


router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user: IUser = await User.findOne({
            email
        }).lean();
        if (!user) return res.status(400).send('User does not exist!');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials!');

        const token = sign({
            id: user._id
        }, "MY-PRIVATE_KEY", {
            expiresIn: 360000
        });
        const payload = {
            token,
            user
        };
        return res.status(200).json(payload);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong!');
    }
});

// Articles Part

router.post('/users/:userId/articles', auth, async (req, res, next) => {
    let post;
    const userId = req.params.userId
    const {
        article_name
    } = req.body;

    if (!article_name || !userId) return res.status(400).send('fields Missing!');
    try {
        const user = await User.findById(userId).lean();
        if (!user) return res.status(400).send('No user found, You are not authorized!');

        post = new Article({
            article_name,
            owner: userId
        });
        post = await Article.create({
            article_name,
            owner: userId
        })

        return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong!');
    }
});


router.get('/articles', auth, async (req, res, next) => {

    try {
        const response = await Article.aggregate([
            {
                '$match': {
                    'isDeleted': false
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'owner',
                    'foreignField': '_id',
                    'as': 'userData'
                }
            },
        ])

        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong!');
    }
});
export default router;