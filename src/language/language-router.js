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
    // implement me
    const userId = req.user.id;
    
    console.log(req.body);
    const words = await 
    LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )
    const ll = await 
    LanguageService.getLanguageLinkedList(
      words
    )
    if (!req.body.guess){
      return res.status(400).json({error:`Missing 'guess' in request body`})
    }
    const guess = req.body.guess;
    const correct = guess === ll.head.data.translation; 

    if (correct){
      // increase correct count for word
      // update total score
    }else{
      // increase incorrect count for word
    }
    // setM
    
    // persist updated words and language in db

    // send response
    // correct :{
    //   "nextWord": "test-next-word-from-correct-guess",
    //   "wordCorrectCount": 111,
    //   "wordIncorrectCount": 222,
    //   "totalScore": 333,
    //   "answer": "test-answer-from-correct-guess",
    //   "isCorrect": true
    // }
    // incorrect: {
    //   "nextWord": "test-next-word-from-incorrect-guess",
    //   "wordCorrectCount": 888,
    //   "wordIncorrectCount": 111,
    //   "totalScore": 999,
    //   "answer": "test-answer-from-incorrect-guess",
    //   "isCorrect": false
    // }

    res.send('implement me!')
  })

module.exports = languageRouter
