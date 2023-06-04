const { User, Thought } = require('../models')

module.exports = {
    // Get all users
    async getUsers(req,res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // Get a user
    async getOneUser(req,res) {
        try {
            const user = await User.findOne({_id: req.params.userId}).select('-__v')

            if (!user) {
                return res.status(404).json({message: 'No user found.'})
            }
            res.json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // Create a user
    async createUser(req,res) {
        try {
            const user = await User.create(req.body)
            res.json(user)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    // Delete a user
    async deleteUser(req,res) {
        try {
            const user = await User.findOneAndDelete({_id: req.params.userId})

            if (!user) {
                res.status(404).json({message: 'No user found.'})
            }
            await Thought.deleteMany({ _id: {$in: user.thoughts}})
            res.json({message: 'User and thoughts deleted!'})
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // Update a user
    async updateUser(req,res) {
        try {
            const course = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$set: req.body},
                {runValidators: true, new: true}
            )
            if (!user) {
                res.status(404).json({message: 'User not found!'})
            }
            res.json(user)
        } catch(err) {
            res.status(500).json(err)
        }
    },
    // Add friend
    async addFriend(req,res) {
        console.log('You are adding a friend.')
        console.log(req.body)

        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$addToSet: {friends: req.body}},
                {runValidators: true, new: true}
            )

            if (!user) {
                return res.status(404).json({message: 'User not found!'})
            }

            res.json(user)
        } catch(err) {
            res.status(500).json(err)
        }
    },
    // Remove friend
    async removeFriend(req,res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$pull: {friends: {friendsId: req.params.friendsId}}},
                {runValidators: true, new: true}
            )

            if (!user) {
                return res.status(404).json({message: 'No user found!'})
            }

            res.json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}