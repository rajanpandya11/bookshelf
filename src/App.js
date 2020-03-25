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
    moveOptions: [ "None", "Read", "Currently Reading", "Want to Read"],
    booksIdByCategory:  { "None":[], "Read": [], "Currently Reading": [], "Want to Read": ["nggnmAEACAAJ", "evuwdDLfAyYC", "jAUODAAAQBAJ"] },
    booksByCategory:  { },
    searchTerm: '',
    searchedBooks: [],
    downloadStarted: false
  }

  fillInTheBooks = () => {
    this.state.moveOptions.map(
      (moveOption) => {
        let arr = this.state.booksIdByCategory[moveOption].slice();
        if(arr.length > 0)
        {
          let bookObjects = [];
          arr.map((bookid) => 
            {
              let thebook = JSON.parse(JSON.stringify(this.state.bookList.filter(book => book.id === bookid)[0]));
              bookObjects.push(thebook);
            }
          );      

          this.setState( (prevState) => {
              let newBooks = {};
              newBooks[moveOption] = bookObjects;
              let newBooksByCategoryObject = Object.assign(JSON.parse(JSON.stringify(prevState.booksByCategory)), newBooks ); 
              return {booksByCategory: newBooksByCategoryObject};
            }, () => {console.log('state after fillintheblanks method complete 1: ', this.state);} 
          );
        } else{
          this.setState( (prevState) => {
              let newBooks = {};
              newBooks[moveOption] = [];
              let newBooksByCategoryObject = Object.assign(JSON.parse(JSON.stringify(prevState.booksByCategory)), newBooks ); 
              return {booksByCategory: newBooksByCategoryObject};
            }, () => {console.log('state after fillintheblanks method complete 2: ', this.state);} 
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
      if(arr[i] === value || arr[i].id === value){
        ans = i;        
        return ans;
      }
    }
  }


  moveTheBook2 = (bookObject) => {
    //if bookObject is not what we want
    if(bookObject === undefined){
      console.log('bookObject was undefined: ', bookObject);
      this.setState({});
      return null;
    }

    // temp copy of the arrays
    let updatedBookListArray = this.state.bookList.slice();
    let updateNewOptionArray = this.state.booksIdByCategory[bookObject.newOption].slice();
    let updateNewOptionArray2 = this.state.booksByCategory[bookObject.newOption].slice();

    if(bookObject.newBook){
      updatedBookListArray.push( bookObject.theBook );     
    }

    if(!bookObject.newBook){

      //get all the data needed i.e. the indexes to be removed

      let updateOldOptionArray = this.state.booksIdByCategory[bookObject.oldOption].slice();
      let updateOldOptionArray2 = this.state.booksByCategory[bookObject.oldOption].slice();
      let oldIndex = this.findTheIndex(updateOldOptionArray, bookObject.bookId);
      bookObject.oldIndex = oldIndex;
      let oldIndex2 = this.findTheIndex(updateOldOptionArray2,bookObject.bookId);
      bookObject.oldIndex2 = oldIndex2;

      //remove it from booksByCategory[oldOption]
      updateOldOptionArray.splice(oldIndex,1);

      //then remove it from booksByCategory[oldOption]
      updateOldOptionArray2.splice(oldIndex2,1);

      //then add it to the bookObject
      bookObject.theBook = this.state.booksByCategory[bookObject.oldOption][oldIndex2]; 
      bookObject.updateOldOptionArray = updateOldOptionArray;
      bookObject.updateOldOptionArray2 = updateOldOptionArray2;
    }



    //make sure not adding duplicate books to arrays
    if(!updateNewOptionArray.includes(bookObject.bookId)){

      //then add it to booksIdByCategory[newOption]
      updateNewOptionArray.push(bookObject.bookId);

      //then add it to booksByCategory[newOption]
      updateNewOptionArray2.push(bookObject.theBook);

    }

    //craete temp objects prior for setstate
    let target1 = JSON.parse(JSON.stringify(this.state.booksIdByCategory));
    target1[bookObject.oldOption] = bookObject.updateOldOptionArray;
    target1[bookObject.newOption] = updateNewOptionArray;

    let target2 = JSON.parse(JSON.stringify(this.state.booksByCategory));
    target2[bookObject.oldOption] = bookObject.updateOldOptionArray2;
    target2[bookObject.newOption] = updateNewOptionArray2;

    //then update the state      
    this.setState({
      booksIdByCategory: target1,
      booksByCategory: target2,
      bookList: updatedBookListArray
    }, ()=> {
      console.log(' App state after moveTheBook is finished: ', this.state);
      console.log(' bookObject after moveTheBook is finished: ', bookObject);
    });
  }


  moveTheBook = (bookObject) => {
    if(bookObject === undefined){
      console.log('bookObject was undefined: ', bookObject);
      this.setState({});
      return null;
    }

    if(bookObject.newBook ){
        // console.log('sending the api call now: ', bookObject); 
        BooksAPI.get(bookObject.bookId).then((book) => {
        // console.log('in the first then func now: ', book); 
        bookObject.theBook = book; 
        // console.log('thebook is added to bookObject: ', bookObject); // Success!
      }, reason => {
        console.log('thebook is not added to bookObject, reason: ', reason); // failure!
      }).then(result =>
          { 
            // console.log('after successful completion bookObject: ', bookObject); 
            this.moveTheBook2(bookObject);
          } 
      );
    }
    else{
      this.moveTheBook2(bookObject);
    }
  }

  render() {
    let moveOptions = ["None", "Read", "Currently Reading" ,"Want to Read"];

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
                  <NewBookList books={this.state.searchedBooks} options={moveOptions} moveTheBook={this.moveTheBook}/> 
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
              {
              moveOptions.map((moveOption, index)=>{
                const booksToShow = this.state.booksByCategory[moveOption];
                return (
                  <BookList key={index+1} bookshelfTitle={moveOption} books={booksToShow} options={moveOptions} moveTheBook={this.moveTheBook} /> 
                );
              })}
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true }, () => { console.log('state after search button clicked: ', this.state); })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default App;
