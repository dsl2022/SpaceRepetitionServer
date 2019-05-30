const ll = require('../linkedlist/linkedlist');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getLanguageLinkedList(words,head){
    const list = new ll();
    let currNode = words[head-1]
    while (currNode.next !== null){
      list.insertLast(currNode);
      currNode = words[currNode.next - 1];
    }
    list.insertLast(currNode);
    return list;
  },
  updateLanguageWords(db,listOfWords){
    // linked list of words
    let currNode = listOfWords.head;
    console.log(currNode);
    while(currNode !== null){
      LanguageService.updateLanguageWord(db,currNode.data);
      currNode = currNode.next;
    }
    return;
  },
  updateLanguageWord(db,word){
    return db
      .from('word')
      .where('id',word.id)
      .update(word)
  },
  updateLanguage(db,language_id,total_score){
    return db
      .from('language')
      .select('*')
      .where('id',language_id)
      .update({total_score})
  }

}

module.exports = LanguageService
