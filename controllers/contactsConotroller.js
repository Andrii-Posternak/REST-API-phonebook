const Contact = require("../models/contact");
const { RequestError } = require("../helpers");
const { contactSchema } = require("../schemas/contacts");

const getContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const result = await Contact.find(
      { owner },
      "-createdAt -updatedAt"
    ).populate("owner", "name email");
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "Missing required name field");
    }
    const { id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });
    const result = await Contact.findById(
      newContact._id,
      "-createdAt -updatedAt"
    ).populate("owner", "name email");
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { id: owner } = req.user;
    const result = await Contact.findOneAndRemove({
      $and: [{ _id: contactId }, { owner }],
    });
    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw RequestError(400, "Missing required name field");
    }
    const { contactId } = req.params;
    const { id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
      {
        $and: [{ _id: contactId }, { owner }],
      },
      req.body,
      {
        new: true,
        fields: "-createdAt -updatedAt",
      }
    ).populate("owner", "name email");
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  addContact,
  removeContact,
  updateContact,
};
