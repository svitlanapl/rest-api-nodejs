const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const data = await listContacts();
  const contact = data.find(item => item.id === contactId);
  return contact;
};

const removeContact = async(contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if(index === -1){
      return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, null, 2)
  );
  return result;
}

const addContact = async (body) => { 
  const data = await listContacts();
  const newContact = { id: uuidv4(), ...body }

  data.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2), 'utf8')

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  if(index < 0) {
    return null;
  }
  contacts[index] = {...contacts[index], ...body};
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
