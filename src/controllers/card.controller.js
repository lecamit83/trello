const Card = require('../models/card.model');
const { validate } = require('../validations/card.validation');

async function createCard(req, res, next) {
  try {
    const { errors , isValid, card } = validate(req.body);
    if(!isValid) return res.status(400).send({ message : errors });
    let myCard = new Card({title : card.title , fromList : req.list._id});
    await myCard.save();
    res.status(201).send({message : 'Created Card' , myCard});
  } catch (error) {
    next(error);
  }
}
async function getCards(req, res, next) {
  try {
    let listId = req.params.listId;
    let cards = await Card.find({ fromList : listId });
    res.status(200).send({cards});
  } catch (error) {
    next(error);
  }
}
async function updateNameCard(req, res, next) {
  try {
    const { errors , isValid, card } = validate(req.body);
    if(!isValid) return res.status(400).send({ message : errors });

    let cardId = req.params.cardId;
    
    let updatedCard = await Card.findById(cardId);
    updatedCard.title = card.title;
    await updatedCard.save();
    
    res.status(200).send({ card : updatedCard });

  } catch (error) {
    next(error);
  }
}

async function deleteCard(req, res, next) {
  try {
    let cardId = req.params.cardId;
    
    let card = await Card.findById(cardId);
    if(!card) return res.status(404).send({message : 'Card Not Found!'});
    await card.remove();
    
    res.status(204).send({message : 'Card was removed!'});
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createCard,
  getCards,
  updateNameCard,
  deleteCard
}
