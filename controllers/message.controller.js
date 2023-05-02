import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res, next) => {
  const { conversationId, desc, userId, isSeller } = req.body;
  const newMessage = new Message({
    conversationId,
    userId: userId,
    desc,
  });
  try {
    const savedMessage = await newMessage.save();

    await Conversation.findOneAndUpdate(
      { id: conversationId },
      {
        $set: {
          readBySeller: isSeller,
          readByBuyer: !isSeller,
          lastMessage: desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ conversationId: id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
