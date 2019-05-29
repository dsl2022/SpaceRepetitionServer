const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

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
  .post('/guess', async (req, res, next) => {
    // implement me
    const userId = req.user.id;
    const guess = req.body;
    const words = await 
    LanguageService.getLanguageWords(
      req.app.get('db'),
      req.language.id,
    )
    const ll = await 
    LanguageService.getLanguageLinkedList(
      words
    )
    console.log(req.body);
    console.log(ll.head.data.translation)
    if (req.body === undefined){
      return res.status(400).json({error:`Missing 'guess' in request body`})
    }
    const guess = req.guess;
    



    res.send('implement me!')
  })

module.exports = languageRouter
