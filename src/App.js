import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import BookList from "./BookList";
import NewBookList from "./NewBookList";

class App extends React.Component {



  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    bookList: [],
    moveOptions: [ "Read", "Currently Reading", "Want to Read"],
    booksIdByCategory:  { "Read": [], "Currently Reading": [], "Want to Read": ["nggnmAEACAAJ", "evuwdDLfAyYC", "jAUODAAAQBAJ"] },
    booksByCategory:  { },
    searchTerm: '',
    searchedBooks: []
  }

  fillInTheBooks = () => {
    this.state.moveOptions.map(
      (moveOption) => {
        const arr = this.state.booksIdByCategory[moveOption];
        if(arr.length > 0)
        {
          const bookObjects = [];
          arr.map((bookid) => 
            {
              const thebook = this.state.bookList.filter(book => book.id === bookid)[0];
              bookObjects.push(thebook);
            }
          );      

          this.setState( (prevState) => {
              const newBooks = {};
              newBooks[moveOption] = bookObjects;
              const newBooksByCategoryObject = Object.assign(prevState.booksByCategory, newBooks ); 
              return {booksByCategory: newBooksByCategoryObject};
            }, () => {console.log('state after fillintheblanks method complete: ', this.state);} 
          );
        } else{
          this.setState( (prevState) => {
              const newBooks = {};
              newBooks[moveOption] = [];
              const newBooksByCategoryObject = Object.assign(prevState.booksByCategory, newBooks ); 
              return {booksByCategory: newBooksByCategoryObject};
            }, () => {console.log('state after fillintheblanks method complete: ', this.state);} 
          );
        }
      }
    );
  }

  componentDidMount(){
    BooksAPI.getAll()
            .then((books)=> 
                  { 
                    this.setState( {bookList : books }, this.fillInTheBooks); 
                  });
  }

  lookUpBooks = (searchTerm) => {
    this.setState( { searchTerm : searchTerm });   
    if(searchTerm.length > 2){
      BooksAPI.search(searchTerm, 30).then((books) => {
        this.setState( { searchedBooks : books }, () => {console.log('state after lookUpBooks method complete: ', this.state);} );
      });
    }
  }

  findTheIndex = (arr,value) => {
    var ans = -1;
    for (var i=0; i< arr.length;i++){
      if(arr[i] === value){
        ans = i;        
        return ans;
      }
    }
  }

  moveTheBook = (newOption, bookid) => {
    //temp is to see if the bookid exist in current state, if it does, then we need to know under which option, and index of it

    let moveOptions = this.state.moveOptions.slice();
    moveOptions.splice(this.findTheIndex(moveOptions,newOption),1);
    let bookObject = {};
    moveOptions.some((option,index) => {
      let oldIndex = this.findTheIndex(this.state.booksIdByCategory[option], bookid);
      if(oldIndex > -1){
        bookObject = { oldCategory: option, oldIndex: oldIndex, bookId: bookid, newCategory: newOption};
        return true;
      }
    });
    
    //create a blank object
    const newObject1 = {};
    //only if bookid is found, then remove it from that option list 
    if(bookObject.oldCategory !== undefined){
      const updatedArray1 = this.state.booksIdByCategory[bookObject.oldCategory].slice();
      updatedArray1.splice(bookObject.oldIndex, 1);
      newObject1[bookObject.oldCategory] = updatedArray1;
    }  

  // so we have a newObject that is really the old category array updated just now with removal of that book.
  // now we will create an another object where this book is moving.

    const updatedArray2 = this.state.booksIdByCategory[newOption].slice();
    updatedArray2.push(bookid);
    const newObject2 = {};
    newObject2[newOption] = updatedArray2;

    const newState1 = Object.assign(this.state.booksIdByCategory, newObject1, newObject2);

    const updatedBooksArray = this.state.bookList.slice();

    const newObject3 = {};
    if(bookObject.oldCategory !== undefined){
      const updatedBooksByCategoryArray1 = this.state.booksByCategory[bookObject.oldCategory].slice();
      const temp2 = this.state.booksByCategory[newOption].forEach((item,index) => {
        if(item.id === bookid)
          return { oldIndex: index }
      });
      if(temp2 !== undefined)
        updatedBooksByCategoryArray1.splice(temp2.oldIndex, 1);
      newObject3[bookObject.oldCategory] = updatedBooksByCategoryArray1;
    }  


    const updatedBooksByCategoryArray2 = this.state.booksByCategory[newOption].slice();

    if( this.state.bookList.filter((book) => book.id === bookid).length > 0){
      const theBook = this.state.bookList.filter((book) => book.id === bookid)[0];
      updatedBooksByCategoryArray2.push(theBook);
    }else{
      BooksAPI.get(bookid)
      .then((book) => {
        updatedBooksArray.push(book);
        updatedBooksByCategoryArray2.push(book);
      });
    }

    const newObject4 = {};
    newObject4[newOption] = updatedBooksByCategoryArray2.slice();

    const newState2 = Object.assign(this.state.booksByCategory, newObject3, newObject4);


    this.setState( {bookList: updatedBooksArray, booksIdByCategory: newState1, booksByCategory: newState2}
      , () => { console.log('state after moveTheBook method complete: ', this.state);  }
    );

  }


  printState = () => {  console.log('current state: ', this.state); }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false }, () => { console.log('state after back button clicked: ', this.state); } )}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author" value={this.state.searchTerm} onChange={(e)=> this.lookUpBooks(e.target.value) }/>
                {
                  this.state.searchedBooks.length > 0 && 
                  <NewBookList books={this.state.searchedBooks} options={this.state.moveOptions} moveTheBook={(a,b) => this.moveTheBook(a,b)}/> 
                }
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
              {this.state.moveOptions.map((moveOption, index)=>{
                const booksToShow = this.state.booksByCategory[moveOption];
                return (
                  <BookList key={index+1} bookshelfTitle={moveOption} books={booksToShow} options={this.state.moveOptions} moveTheBook={(a,b) => this.moveTheBook(a,b)} /> 
                );
              })}
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true }, () => { console.log('state after search button clicked: ', this.state); })}>Add a book</a>
            </div>
          </div>
        )}
        <button onClick={this.printState}> print the state</button>
      </div>
    )
  }
}

export default App;
