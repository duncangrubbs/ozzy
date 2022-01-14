![CI](https://github.com/duncangrubbs/ozzy/workflows/CI/badge.svg?event=push)
# 🦘 ozzy
> A small, easy to compose, API interface

Ozzy is a service for interacting with APIs from a Javascript/Typescript client. It is essentially a stripped down version of axios with the inclusion of a middleware feature similar to [Express](https://expressjs.com/) and [axios interceptors](https://axios-http.com/docs/interceptors). It was origionally inspired by this [blog post](https://duncangrubbs.com/blog/oct012020) but has since been updated after more learning on my end. In fact, I recently wrote a new blog post about one of my favorite [uses of middleware](https://duncangrubbs.com/blog/jan122022).

If you are building a web app with a modern framework but don't want to install another huge library like axios (almost 400kb!), ozzy is a option to start with, even if you outgrow it eventually.

## 🤝 Design Principles
1. Lightweight -- _Keep it small, why not?_
2. Easy to Use -- _Simple, straightforward, well-documented functions_
3. Zero Dependencies -- _Outside of dev dependencies, there are no dependencies, so you can get up and running fast in any project_
4. Framework Agnostic -- _Works with any framework_

## 🔨 Docs
### REST Methods
Ozzy is similar to [axios](https://axios-http.com/docs/intro) in that is provides a core set of functions for making HTTP requests. You start by constructing an `Api` for a specific backend service that your client needs to interact with.
```javascript
const userService = new Api(baseUrl, auth, ...middleware)
```

You provide the constructor with a `baseUrl`, an authentication service, and an optional collection of middleware functions. This service now has a similar API to axios. For example you can do something like
```javascript
userService
  .get('/region/europe')
  .then(response => console.log(response))
  .catch(error => console.error(error))
```

Under the hood this builds the request headers and options, sends the fetch request, applies all of your middleware functions and returns you the final result.

### Auth
Ozzy supports basic auth out of the box. You can configure your auth at the service level by injecting the class into the `Api` constructor. To setup auth for the service, you build an `Auth` object.
```javascript
const auth = new Auth(AuthTypes.Bearer, userToken, 'Authorization')

const service = new Api(url, auth...)
```

This code configures the service to send the provided token in the `Authorization` header. The `AuthType` determines the format of this header. In the case the header would look like
```
Authorization: Bearer YOUR_TOKEN
```

### Middleware
At the core of Ozzy is the concept of middleware. This can be applied at the service level or the request level. Middleware intercepts the `Response` object, does something to it, and then passes it to the next middleware. It is important to keep in mind that order matters.
```javascript
const middlewareOne = (data, next) => {
  // do something to the response data
  // of all requests made with this service
  return next(data)
}

const myService = new Api(
  baseUrl,
  new Auth(),
  middlewareOne
)

const middlewareTwo = (data, next) => {
  // do something to the response data that is
  // specific to this request
  return next(data)
}

myService.get('/api/foo/bar', middlewareTwo).then(data => console.log(data))
```

For those of you who have written a lot of Javascript, you are probably familiar with writing something like this
```javascript
fetch('some url', headers, ...options)
  // check the response status code
  .then(response => checkStatus(response))
  // parse as json
  .then(response => response.json())
  // finally return the response
```
With Ozzy, you can write a middleware function once, and then apply it at the service level or request level. Out of convenience, ozzy comes with a few middlewares out of the box. Of course it is your choice if you want to apply these middlewares, but they are already written so that you do not have write them yourself. These include a middleware to parse the response as JSON, a basic logger, and a middleware to check the status code of the response and reject the promise if it is outside of the safe range (200-300).

## 🙌 Contributing
Feel free to fork and make PRs, they are always welcome! There is a lot of work to do on this project and any help is appreciated. If you don't know where to start you can check out the [issues](https://github.com/duncangrubbs/ozzy/issues) page.
