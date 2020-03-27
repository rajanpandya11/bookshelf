import React from 'react'
import * as BooksAPI from './BooksAPI'
import { Link, Route } from 'react-router-dom';
import BookList from "./BookList";
import './App.css'
import SearchPage from './SearchPage';

class App extends React.Component {

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    bookList: [],
    moveOptions: [ "None", "Read", "Currently Reading", "Want to Read"],
    searchTerm: '',
    searchedBooks: []
  }

  lookUpBooks = (searchTerm) => {
    this.setState( { searchTerm : searchTerm });   
    if(searchTerm.length > 2){
      BooksAPI.search(searchTerm, 30).then((books) => {
        this.setState( { searchedBooks : books }, () => {console.log('state after lookUpBooks method complete: ', this.state);} );
      });
    }
  }

  downloadTheBook = (bookObject) => {
    if(bookObject === undefined){
      console.log('bookObject was undefined: ', bookObject);
      this.setState({});
      return null;
    }

    if(bookObject.newBook ){
        // console.log('sending the api call now: ', bookObject); 
        BooksAPI.get(bookObject.bookId).then((book) => 
        {
          book.shelf = bookObject.newOption;
          // console.log('in the first then func now: ', book); 
          bookObject.theBook = book; 
          // console.log('thebook is added to bookObject: ', bookObject); // Success!
        }, reason => {
          console.log('thebook is not added to bookObject, reason: ', reason); // failure!
      }).then(result =>
          { 
            // console.log('after successful completion bookObject: ', bookObject); 
            this.moveTheBook(bookObject);
          } 
      );
    }
    else{
      this.moveTheBook(bookObject);
    }
  }

  isNewBook = (theBook) => {
    let books = this.state.bookList.slice();
    let flag = true;
    books.some((book) => {
      if(book.id === theBook.id){
        flag = false;
        return true;
      }
    });

    return flag;
  }

  moveTheBook = (bookObject) => {
    let books = this.state.bookList.slice();
    if(bookObject.theBook){

      books.push(bookObject.theBook);
      this.setState({bookList: books});

    }
    else{

      let theBook = books.filter((book) => book.id === bookObject.id)[0];
      bookObject.theBook = theBook;
      let bookIndex;
      books.some((book,index) => { if(book.id=== bookObject.theBook.id) {bookIndex = index; return true ;}});
      books.splice(bookIndex,1);
      books.push(bookObject.theBook);
      this.setState({bookList: books});

    }

  }

  booksByCategory = (category) => {
    let books = [];

    if(category === "None")
      return books;

    this.state.bookList.forEach((book) => 
    {
        if(book.shelf === category)
            books.push(book);
    });

    return books;
  }

  bookIdsByCategory = (category) => {
    let books = [];

    if(category === "None")
      return books;

    this.state.bookList.forEach((book) => 
    {
        if(book.shelf === category)
            books.push(book.id);
    });

    return books;
  }

  

  render() {
    let moveOptions = this.state.moveOptions;
    let searchedBooks = this.state.searchedBooks;
    let searchTerm = this.state.searchTerm;

    return (
      <div className="app">

          <Route exact path="/" render={() => (

              <div className="list-books">
                <div className="list-books-title">
                  <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                  <div>
                  {
                    moveOptions.map((moveOption, index)=>{
                      return (
                        <BookList key={index+1} bookshelfTitle={moveOption} books={this.booksByCategory(moveOption)} options={moveOptions} moveTheBook={this.moveTheBook} /> 
                      );
                    })
                  }
                  </div>
                </div>

                <div className="open-search">
                  <Link to="/search" >Add a book</Link>
                </div>
              </div>

          )}/>

          <Route exact path="/search" render={({history})=> (
               <SearchPage 
               searchedBooks={searchedBooks} moveOptions={moveOptions} lookUpBooks={this.lookUpBooks} searchTerm={searchTerm} 
               moveTheBook={ (bookObject) => {
                 this.downloadTheBook(bookObject); history.push('/');
               } }
               
               />

          )} />

      </div>
    )
  }
}

export default App;

 




// findTheIndex = (arr,value) => {
//   var ans = -1;
//   for (var i=0; i< arr.length;i++){
//     if(arr[i] === value || arr[i].id === value){
//       ans = i;        
//       return ans;
//     }
//   }
// }

// componentDidMount(){
//   BooksAPI.getAll()
//           .then((books)=> 
//                 { 
//                   this.setState( {bookList : books }); 
//                 });
// }



// fillInTheBooks = () => {
//   this.state.moveOptions.map(
//     (moveOption) => {
//       if(moveOption === "None") return null;

//       let arr = this.bookIdsByCategory(moveOption);
//       if(arr.length > 0)
//       {
//         let bookObjects = [];
//         arr.map((bookid) => 
//           {
//             let thebook = JSON.parse(JSON.stringify(this.state.bookList.filter(book => book.id === bookid)[0]));
//             bookObjects.push(thebook);
//           }
//         );      

//         this.setState( (prevState) => {
//             let newBooks = {};
//             newBooks[moveOption] = bookObjects;
//             let newBooksByCategoryObject = Object.assign(JSON.parse(JSON.stringify(prevState.booksByCategory)), newBooks ); 
//             return {booksByCategory: newBooksByCategoryObject};
//           }, () => {console.log('state after fillintheblanks method complete 1: ', this.state);} 
//         );
//       } else{
//         this.setState( (prevState) => {
//             let newBooks = {};
//             newBooks[moveOption] = [];
//             let newBooksByCategoryObject = Object.assign(JSON.parse(JSON.stringify(prevState.booksByCategory)), newBooks ); 
//             return {booksByCategory: newBooksByCategoryObject};
//           }, () => {console.log('state after fillintheblanks method complete 2: ', this.state);} 
//         );
//       }
//     }
//   );
// }


// moveTheBook2 = (bookObject) => {
//   //if bookObject is not what we want
//   if(bookObject === undefined){
//     console.log('bookObject was undefined: ', bookObject);
//     this.setState({});
//     return null;
//   }

//   // temp copy of the arrays
//   let updatedBookListArray = this.state.bookList.slice();
//   let updateNewOptionArray = this.state.booksIdByCategory[bookObject.newOption].slice();
//   let updateNewOptionArray2 = this.state.booksByCategory[bookObject.newOption].slice();

//   if(bookObject.newBook){
//     updatedBookListArray.push( bookObject.theBook );     
//   }

//   if(!bookObject.newBook){

//     //get all the data needed i.e. the indexes to be removed

//     let updateOldOptionArray = this.state.booksIdByCategory[bookObject.oldOption].slice();
//     let updateOldOptionArray2 = this.state.booksByCategory[bookObject.oldOption].slice();
//     let oldIndex = this.findTheIndex(updateOldOptionArray, bookObject.bookId);
//     bookObject.oldIndex = oldIndex;
//     let oldIndex2 = this.findTheIndex(updateOldOptionArray2,bookObject.bookId);
//     bookObject.oldIndex2 = oldIndex2;

//     //remove it from booksByCategory[oldOption]
//     updateOldOptionArray.splice(oldIndex,1);

//     //then remove it from booksByCategory[oldOption]
//     updateOldOptionArray2.splice(oldIndex2,1);

//     //then add it to the bookObject
//     bookObject.theBook = this.state.booksByCategory[bookObject.oldOption][oldIndex2]; 
//     bookObject.updateOldOptionArray = updateOldOptionArray;
//     bookObject.updateOldOptionArray2 = updateOldOptionArray2;
//   }



//   //make sure not adding duplicate books to arrays
//   if(!updateNewOptionArray.includes(bookObject.bookId)){

//     //then add it to booksIdByCategory[newOption]
//     updateNewOptionArray.push(bookObject.bookId);

//     //then add it to booksByCategory[newOption]
//     updateNewOptionArray2.push(bookObject.theBook);

//   }

//   //craete temp objects prior for setstate
//   let target1 = JSON.parse(JSON.stringify(this.state.booksIdByCategory));
//   target1[bookObject.oldOption] = bookObject.updateOldOptionArray;
//   target1[bookObject.newOption] = updateNewOptionArray;

//   let target2 = JSON.parse(JSON.stringify(this.state.booksByCategory));
//   target2[bookObject.oldOption] = bookObject.updateOldOptionArray2;
//   target2[bookObject.newOption] = updateNewOptionArray2;

//   //then update the state      
//   this.setState({
//     booksIdByCategory: target1,
//     booksByCategory: target2,
//     bookList: updatedBookListArray
//   }, ()=> {
//     console.log(' App state after moveTheBook is finished: ', this.state);
//     console.log(' bookObject after moveTheBook is finished: ', bookObject);
//   });
// }
