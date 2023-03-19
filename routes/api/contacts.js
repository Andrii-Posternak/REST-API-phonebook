const express = require("express");
const contactsController = require("../../controllers/contactsConotroller");
const { auth } = require("../../middlewares");

const router = express.Router();

router.get("/", auth, contactsController.getContacts);

router.get("/:contactId", auth, contactsController.getContactById);

router.post("/", auth, contactsController.addContact);

router.delete("/:contactId", auth, contactsController.removeContact);

router.put("/:contactId", auth, contactsController.updateContact);

router.patch(
  "/:contactId/favorite",
  auth,
  contactsController.updateStatusContact
);

module.exports = router;
