const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{5,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
});

const Person = mongoose.model('Person', personSchema);

personSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const getAllPersons = async (_, response, next) => {
  Person.find().lean(false).exec().then(result => {
    if (result.length === 0) {
      response.status(200).json([]);
      return;
    }
    response.json(result);
  }).catch(error => next(error));
};

const createPerson = async (request, response, next) => {
  const { name, number } = request.body;
  const newPerson = { name, number };

  Person.findOne({ name }).exec().then(exist => {
    if (exist) {
      response.status(409).json({ message: 'This person is already register in phonebook.' });
      return;
    }
    Person.create(newPerson).then(result => {
      response.send(result);
    }).catch(error => next(error));
  }).catch(error => next(error));
};

const deletePerson = async (request, response, next) => {
  const { id } = request.params;

  Person.findByIdAndRemove(id).lean().exec().then(result => {
    response
      .status(204)
      .json({ message: `The information ood ${result.name} has been deleted.` });
  }).catch(error => {
    console.log(error.response.data.error);
    next(error);
  });
};

const getPersonById = async (request, response, next) => {
  const { id } = request.params;

  Person.findById(id).lean(false).exec().then(result => {
    if (!result) {
      response.status(404).json({ message: 'No person was found.' });
      return;
    }
    response.json(result);
  }).catch(error => next(error));
};

const updatePerson = async (request, response, next) => {
  const { id } = request.params;
  const { name, number } = request.body;

  const updatedPerson = {
    name, number
  };

  Person.findByIdAndUpdate(id, updatedPerson, { new: true }).lean(false).exec().then(result => {
    response.json(result);
  }).catch(error => next(error));
};

router.route('/').get(getAllPersons).post(createPerson);

router.route('/:id').get(getPersonById).delete(deletePerson).put(updatePerson);

module.exports = router;
