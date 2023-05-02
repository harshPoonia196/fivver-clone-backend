import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res, next) => {
  // const { isSeller, userId, to } = req.body;
  const { isSeller, userId, to } = req.body;

  console.log("req.body from create conv ===========>", req.body);

  try {
    const newConversation = await Conversation.create({
      id: userId + to,
      sellerId: isSeller ? userId : to,
      buyerId: isSeller ? to : userId,
      readBySeller: isSeller,
      readByBuyer: !isSeller,
    });

    res.status(201).send(newConversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOne({ id: id });
    console.log("getSingleConversation ===========>", conversation);

    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const { isSeller, userId } = req.body;

    console.log(" req.body ===========>", req.body);

    const conversations = await Conversation.find(
      isSeller ? { sellerId: userId } : { buyerId: userId }
    );

    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};
