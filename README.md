# MyReads Project

The app is made with `create-react-app` template, and can be build simply by `npm install` and then `npm start` commands.

This app is a personal online bookshelf. Here, you can add books to different shelves, move them around, or remove them from shelves. 

The approach was to start with making components (thinking in React) and what they will be used for.

* A Book Component was required, to display the content of just a book, and the component can be reused to display all books by passing in book information by props.

* There are two main pages (homepage and searchpage), I made use of routes (react-router), so that user can go back and forth by the app's navigation buttons and browser's buttons. 
    * moving an existing book from a shelf to different shelf
    * searching new books and adding them to a shelf

My initial approach was to store all the user's book related activities locally (which changed after I learned more about the Udacity data API). I made the code working. It was storing the changes made by user, but since the state can only be saved as long as the page is not hard refreshed, I had to change everything or start from scratch again. The API was allowing me to pass in updated shelf value for books. If the updated values could be stored this way, it means the values can be received by get method back to app, and this way I can set it up so app state does not change with a page refresh.


## Instruction to install and launch the application

* install all project dependencies with `npm install` or `yarn`
* start the development server with `npm start` or `yarn start`

## Code structure 
```bash
├── README.md - This file.
├── SEARCH_TERMS.md # The whitelisted short collection of available search terms for you to use with your app.
├── package.json # npm package manager file. It's unlikely that you'll need to modify this.
├── public
│   ├── favicon.ico # React Icon, You may change if you wish.
│   └── index.html # DO NOT MODIFY
└── src
    ├── App.css # Styles for your app. Feel free to customize this as you desire.
    ├── App.js # This is the root of your app. Contains static HTML right now.
    ├── App.test.js # Used for testing. Provided with Create React App. Testing is encouraged, but not required.
    ├── Book.js # This is used to display individual book  
    ├── BooksAPI.js # A JavaScript API for the provided Udacity backend. Instructions for the methods are below.
    ├── BookList.js # This is used to show user's books and the shelves they are in 
    ├── SearchPage.js # This is a page where user can search keywords and get books in response
    ├── icons # Helpful images for your app. Use at your discretion.
    │   ├── add.svg
    │   ├── arrow-back.svg
    │   └── arrow-drop-down.svg
    ├── index.css # Global styles. You probably won't need to change anything here.
    └── index.js # You should not need to modify this file. It is used for DOM rendering only.
```

## React components and code functionality

### [`App.js`](src/App.js)
This is app's main component

```js
state {
    bookShelves: [],
    bookList: []
}
```
* bookShelves `<array>`: This contains different bookshelf names
* bookList `<array>`: This contains book objects that user has selected to move to one of shelves

```js
componentDidMount()
```
* This functions is invoked after component is mounted on DOM and to fetch data

```js
downloadTheBooks()
```
* this functions downloads the books from server using api

```js
isNewBook(newBook)
```
* newBook `<object>`: the book object
* this functions takes in a book object and returns if it is already in app state or a new book

```js
updateBookList(book)
```
* book `<object>`: the book object
* This functions fetches the given book from server and updates the booklist to display it on front end. 


### [`Book.js`](src/Book.js)
this component displays an individual book

```js
props {
    book: {},
    shelves: [],
    handleChange: func()
}
```

```js
stringsForDisplay(str)
```
* str: `<string>` given non-empty string
* this function returns a formatted string based on given string for front end display purposes.


```js
handleChange(event)
```
* event: `<object>` it is an event object that is raised when a new shelf option is selected by user 
* this function manages change event on book's shelf change.


### [`BookList.js`](src/BookList.js)
this component renders UI for books and shelves on homepage 

```js
props {
    shelves: [], 
    bookshelf: '',
    updateBookList: func()
}
```

```js
componentDidMount()
```
* This function is invoked after component is mounted on DOM and to fetch data

```js
getTheBooks()
```
* this function returns a book list for a bookshelf, given to the component via props

```js
handleChange(newShelf, book)
```
* book `<object>`: the book object
* newShelf `<string>`: new shelf for the book object 
* this functions checks if a book is already in app state or is a new book

```js
stringsForDisplay(str)
```
* str: `<string>` given non-empty string
* this function returns a formatted string based on given string for front end display purposes.



### [`SearchPage.js`](src/SearchPage.js)
this component manages and displays to `/search` url page. user can search books, and the results will be shown on the page only when the query is one of the keywords.

```js
state
{
    searchTerm: '',
    searchedBooks: [],
    keywords: []
}
props
{
    bookShelves: [],
    updateBookList: func(),
    bookList: []
}
```

```js
handleSearch(query)
```
* query `<string>`: query is what user types in to input field
* this function fetches books based on given search terms


```js
findTheShelf(book)
```
* book `<object>`: the book object
* this function finds, based on a book id, whether a book is assigned a shelf, by user 


```js
handleChange(newShelf, book)
```
* newShelf `<string>`: new value for shelf to be updated for the book object
* book `<object>`: the book object
* this function updates shelf for a book, when a new shelf is clicked from UI in book's drop down menu 



## Routes

There are two routes `/` and `/search`.

`App` component renders UI for the `/` route, and `SearchPage` component renders UI for the `/search` route.


## Backend Server

To simplify your development process, we've provided a backend server for you to develop against. The provided file [`BooksAPI.js`](src/BooksAPI.js) contains the methods you will need to perform necessary operations on the backend:

* [`getAll`](#getall)
* [`update`](#update)
* [`search`](#search)

### `getAll`

Method Signature:

```js
getAll()
```

* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* This collection represents the books currently in the bookshelves in your app.

### `update`

Method Signature:

```js
update(book, shelf)
```

* book: `<Object>` containing at minimum an `id` attribute
* shelf: `<String>` contains one of ["wantToRead", "currentlyReading", "read"]  
* Returns a Promise which resolves to a JSON object containing the response data of the POST request

### `search`

Method Signature:

```js
search(query, maxResults)
```

* query: `<String>`
* maxResults: `<Integer>` Due to the nature of the backend server, search results are capped at 20, even if this is set higher.
* Returns a Promise which resolves to a JSON object containing a collection of book objects.
* These books do not know which shelf they are on. They are raw results only. You'll need to make sure that books have the correct state while on the search page.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.


