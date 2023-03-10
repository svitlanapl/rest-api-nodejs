const { Contact } = require('../models/contact');

const { HttpError, ctrlWrapper } = require('../helpers');

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const result = await Contact.findById({ _id: contactId, owner: userId });
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({...req.body, owner });
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const result = await Contact.findByIdAndRemove({ _id: contactId, owner: userId });
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Contact deleted"
  });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: userId }, req.body, {new: true});
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id: userId } = req.user;

  if (!favorite  ) {
    res.status(400).json({ message: '"message": "missing fields"' });
  };

  const result = await Contact.findByIdAndUpdate({ _id: contactId, owner: userId }, req.body, { new: true });
  
  if(!result){
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact: ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite),
}