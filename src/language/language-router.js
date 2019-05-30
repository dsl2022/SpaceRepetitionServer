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
    // console.log('>>>>>lang:',req.language);
    const userId = req.user.id;
    const words = await 
    LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )
    // console.log('>>>>>words:',words)
    const ll = await 
    LanguageService.getLanguageLinkedList(
      words,
      req.language.head
    )
    // console.log('>>>>ll:',ll);
    const word = ll.head.data;
    const guess = req.body.guess;
    const correct = guess === word.translation; 
    let total_score = new Number(req.language.total_score);
    let result = {
      "nextWord": ll.head.next.data.original,
      "wordCorrectCount":ll.head.data.correct_count,
      "wordIncorrectCount": ll.head.data.incorrect_count,
      "totalScore":total_score,
      "answer":ll.head.data.translation,
      "isCorrect":correct
    };
    if (correct){
      // increase correct count for word
      word.correct_count++;
      // update total score
      total_score += 1;
    }else{
      // increase incorrect count for word
      word.incorrect_count++;
    }
    // setM
    ll.setM(correct);
    console.log('><><><><>new ll:',ll);
    // persist updated words and language in db
    await LanguageService.updateLanguageWords(req.app.get('db'),ll);
    await LanguageService.updateLanguage(req.app.get('db'),req.language.id,total_score)


    // send response
    res.send(result)
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
