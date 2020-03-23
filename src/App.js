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
    booksIdByCategory:  { "Read": ["nggnmAEACAAJ"], "Currently Reading": ["nggnmAEACAAJ"], "Want to Read": ["nggnmAEACAAJ", "evuwdDLfAyYC", "jAUODAAAQBAJ"] },
    booksByCategory:  { },
    searchTerm: '',
    searchedBooks: []
  }

  fillInTheBooks = () => {
    console.log('state after all book fetch: ', this.state.bookList);

    this.state.moveOptions.map(
      (moveOption) => {
        const arr = this.state.booksIdByCategory[moveOption];
        if(arr.length > 0)
        {
          const bookObjects = [];
          arr.map((bookid) => 
            {
              console.log('inside books id array');
              console.log('this value: ', bookid);
              const thebook = this.state.bookList.filter(book => book.id === bookid)[0];
              bookObjects.push(thebook);
            }
          );      

          this.setState( (prevState) => {
            const newBooks = {};
            newBooks[moveOption] = bookObjects;
            return {booksByCategory: Object.assign(prevState.booksByCategory, newBooks )};
          })
        } else{
          this.setState( (prevState) => {
            const newBooks = {};
            newBooks[moveOption] = [];
            return {booksByCategory: Object.assign(prevState.booksByCategory, newBooks )};
          } );
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
        this.setState( { searchedBooks : books })
      });
    }
  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
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
                  <NewBookList books={this.state.searchedBooks} options={this.state.moveOptions} /> 
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
                  <BookList key={index+1} bookshelfTitle={moveOption} books={booksToShow} options={this.state.moveOptions} /> 
                );
              })}
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default App;
