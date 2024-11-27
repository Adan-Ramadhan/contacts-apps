
const fs = require("fs");



// // membuat folder data jika belum ada
const dirPath = "./data"
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// // membuat file contacts.josn jika belum ada
const dataPath = "./data/contacts.json"
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContacts = () => {
  const file = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};


const findContact = (nama) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact => contact.nama.toLowerCase() === nama.toLowerCase()));
  return contact;
};

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contact) => {
  fs.writeFileSync("./data/contacts.json", JSON.stringify(contact));
};

// menambahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContacts();
  contacts.push(contact);
  saveContacts(contacts);
};

// cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContacts();
  return contacts.find(contact => contact.nama.toLowerCase() === nama.toLowerCase());
};

const deleteContact = (nama) => {
  const contacts = loadContacts();
  const filtredContact = contacts.filter(contact => contact.nama !== nama);
  saveContacts(filtredContact);
};

// mengubah contacts
const updateContacts = (contactBaru) => {
  const contacts = loadContacts();
  // Hilangan contact lama yang namanya sama dengan oldNama
  const filtredContact = contacts.filter(contact => contact.nama !== contactBaru.oldNama);
  delete contactBaru.oldNama;
  filtredContact.push(contactBaru);
  saveContacts(filtredContact);

}


module.exports = {loadContacts, findContact, addContact, cekDuplikat, deleteContact, updateContacts};