const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
}

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(contacts);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const searchedContact = contacts.find((contact) => contact.id === contactId);
  return searchedContact || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;
  const [deletedContact] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return deletedContact;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: uuid(), ...body };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) return null;
  contacts[index] = { id: contactId, ...body };
  await updateContacts(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
