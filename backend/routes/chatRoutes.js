const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Get all chats for the authenticated user or owner
router.get('/', auth, async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ user: req.user.id }, { owner: req.user.id }]
        })
            .populate('hostel', 'name')
            .populate('user', 'name email')
            .populate('owner', 'name email')
            .populate('messages.sender', 'name')
            .lean();
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new chat or add a message to an existing chat
router.post(
    '/',
    [
        auth,
        check('hostelId', 'Hostel ID is required').isMongoId(),
        check('message', 'Message content is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { hostelId, message } = req.body;

        try {
            const hostel = await Hostel.findById(hostelId).populate('owner');
            if (!hostel) {
                return res.status(404).json({ message: 'Hostel not found' });
            }

            let chat = await Chat.findOne({
                hostel: hostelId,
                user: req.user.id,
                owner: hostel.owner._id
            });

            const newMessage = {
                sender: req.user.id,
                content: message
            };

            if (chat) {
                chat.messages.push(newMessage);
                await chat.save();
            } else {
                chat = new Chat({
                    hostel: hostelId,
                    user: req.user.id,
                    owner: hostel.owner._id,
                    messages: [newMessage]
                });
                await chat.save();
            }

            res.status(201).json(chat);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

// Reply to an existing chat
router.post(
    '/:chatId/message',
    [
        auth,
        check('message', 'Message content is required').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { message } = req.body;

        try {
            const chat = await Chat.findById(req.params.chatId);
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }

            if (chat.owner.toString() !== req.user.id && chat.user.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            chat.messages.push({
                sender: req.user.id,
                content: message
            });

            await chat.save();
            res.json(chat);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
);

module.exports = router;