const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    const words = await 
    LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )
    res.send({
      "nextWord": words[req.language.head-1].original,
      "wordIncorrectCount": words[req.language.head-1].incorrect_count,
      "wordCorrectCount": words[req.language.head-1].correct_count,
      "totalScore": req.language.total_score
    })
  })

languageRouter
  .route('/guess')
  .post(jsonBodyParser, async (req, res, next) => {
    if (!req.body.guess){
      return res.status(400).json({error:`Missing 'guess' in request body`})
    }
    const words = await 
    LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )
    const ll = await 
    LanguageService.getLanguageLinkedList(
      words,
      req.language.head
    )
<<<<<<< HEAD
    console.log(req.body);
    console.log(ll.head.data.translation)
    if (req.body === undefined){
      return res.status(400).json({error:`Missing 'guess' in request body`})
    }
   
||||||| merged common ancestors
    console.log(req.body);
    console.log(ll.head.data.translation)
    if (req.body === undefined){
      return res.status(400).json({error:`Missing 'guess' in request body`})
    }
    const guess = req.guess;
=======
    // keeping track of current word
    const word = ll.head.data;
    const guess = req.body.guess;
    const answer = ll.head.data.translation;
    let total = new Number(req.language.total_score);
    const nextWord = ll.head.next.data.original;
>>>>>>> 040633d77f699815f53cf5f44fdca50bdf417e4e
    
    // checking to see if guess was correct
    const correct = guess === word.translation; 
    if (correct){
      // increase correct count for word
      ll.head.data.correct_count++;
      // update total score
      total += 1;
    }else{
      // increase incorrect count for word
      ll.head.data.incorrect_count++;
    }

    // setM
    ll.setM(correct);

    // persist updated words and language in db
    await LanguageService.updateLanguageWords(
      req.app.get('db'),
      ll
    );
    await LanguageService.updateLanguage(
      req.app.get('db'),req.language.id,
      total,
      ll.head.data.id
    );

    // send response
    res.send({
      "nextWord": nextWord,
      "wordCorrectCount":ll.head.data.correct_count,
      "wordIncorrectCount": ll.head.data.incorrect_count,
      "totalScore":total,
      "answer":answer,
      "isCorrect":correct
    })
  })

module.exports = languageRouter
