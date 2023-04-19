const asyncHandler = require("express-async-handler");
const contact = require('../models/contactModel')

//@desc: Get all contatcs
//@route: GET /api/contacts
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contacts = await contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc: Get a contact
//@route: GET /api/contacts/:id
//@access private
const getIdContact = asyncHandler(async (req, res) => {
  const idContact = await contact.findById(req.params.id);
  if (!idContact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.status(200).json(idContact);
});

//@desc: create new contact
//@route: POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Data Missing");
  }

  console.log(name, email, phone);
  const newContact = await contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });

  res.status(201).json(newContact);
});

//@desc: update a contact
//@route: PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const idContact = await contact.findById(req.params.id);
  if (!idContact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  if (idContact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update");
  }

  const updatedContact = await contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
});


//@desc: Delete a contact
//@route: DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const idContact = await contact.findById(req.params.id);
  if (!idContact) {
    res.status(404);
    throw new Error('Contact not found');
  }

  if (idContact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to Delete");
  }
  await contact.findByIdAndDelete(req.params.id);
  res.status(200).json(idContact);
});

module.exports = { getContact, getIdContact, createContact, deleteContact, updateContact };