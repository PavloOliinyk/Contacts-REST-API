const express = require('express');
const router = express.Router();
const { NotFound, BadRequest } = require('http-errors');
const Joi = require('joi');

const { Contact } = require('../../models/');
const { authenticate } = require('../../middlewares/');

const schemaUpdate = Joi.object({
  name: Joi.string()
    .pattern(/^[a-z ,.'-]+$/i, 'name')
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?3?8?(0\d{9})$/, 'numbers')
    .required(),
  favorite: Joi.bool(),
});

const contactShemaUpdate = Joi.object({
  name: Joi.string().pattern(/^[a-z ,.'-]+$/i, 'name'),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?3?8?(0\d{9})$/, 'numbers'),
  favorite: Joi.bool(),
}).min(1);

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;
    const { _id } = req.user;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find(
      { owner: _id, favorite },
      '-createdAt -updatedAt',
      { skip, limit: Number(limit) },
    );
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw new NotFound();
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { error } = schemaUpdate.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const { _id } = req.user;
    const newContact = await Contact.create({ ...req.body, owner: _id });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      throw new NotFound();
    }
    res.json({ message: 'contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { error } = contactShemaUpdate.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const { id } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/favorite', authenticate, async (req, res, next) => {
  try {
    const { error } = contactShemaUpdate.validate(req.body);

    if (error) {
      throw new BadRequest(error.message);
    }

    const { id } = req.params;
    const { favorite } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      {
        new: true,
      },
    );

    if (!updatedContact) {
      throw new NotFound();
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
