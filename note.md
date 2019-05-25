### Which database tables are created in the migrations?

### What are the endpoints for user registration, login and refresh?
```
/api/auth'
/api/language'
/api/user'
```

### What endpoints have been implemented in the language router?

```
'/'
'/head'
'/guess'

```

### What is the async and await syntax for? (Hint)

async ensures that the function returns a promise, and wraps non-promises in it.

The keyword await makes JavaScript wait until that promise settles and returns its result.

### Which endpoints need implementing in the language router?
```
'/head'
'/guess'
```




How does the GET /api/language endpoint decide which language to respond with? (Hint: Does it relate to the user that made the request?)
In the UserService.populateUserWords method, what is db.transaction?