const Card = require('../models/card.model');
const { validate, validateTitle } = require('../validations/card.validation');

async function createCard(req, res, next) {  
  try {
    const errors = validateTitle(req.body.title);
    if(!errors) return res.status(400).send({ message : errors });
    
    let list = req.list;
    let card = new Card({ title : req.body.title , from : list._id});
    await card.save();

    list.cards.push({card : card._id}); 
    await list.save();
    
    res.status(201).send({message : 'Created Card' , card});
  } catch (error) {
    next(error);
  }
}
async function getCards(req, res, next) {
  try {
    let listId = req.params.listId;
    let cards = await Card.find({ from : listId }).select('title members');
    res.status(200).send({cards});
  } catch (error) {
    next(error);
  }
}
async function updateCard(req, res, next) {
  try {

    let cardId = req.params.cardId;
    
    let updatedCard = await Card.findById(cardId);
    updatedCard.title = req.body.title || updatedCard.title;
    updatedCard.description = req.body.description || updatedCard.description;
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
    
    let list = req.list;
    list.cards = list.cards.filter(e => e.card.toString() !== cardId.toString());
    await list.save();

    res.status(204).send({message : 'Card was removed!'});
  } catch (error) {
    next(error);
  }
}

async function addInfo(req, res, next) {
  try {
   
    let card = validate(req.body);

    let cardId = req.params.cardId;
   
    
    let updatedCard = await Card.findById(cardId);
    card = {...updatedCard , ...card};
    console.log(card);
    
    await updatedCard.save();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCard,
  getCards,
  updateCard,
  deleteCard,
  addInfo
}
