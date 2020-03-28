import React,{ Component } from "react";
import { Link, Route } from 'react-router-dom';
import * as BooksAPI from "./BooksAPI";
import './App.css'
import BookList from "./BookList";
import SearchPage from "./SearchPage";


/**
* @description this is main component
*/
class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            bookShelves: ["none", "read", "currentlyReading", "wantToRead"],
            bookList: []
        }
    }

    /**
    * @description this functions invokes after component is mounted on DOM and to do any ajax sort of requests
    */
    componentDidMount(){
        this.downloadTheBooks();
    }


    /**
    * @description this functions gets invoked when user moves a book to a new shelf both from home page and search page
    * @param {object} book - the book object
    */
    updateBookList = (book) => {
        BooksAPI.get(book.id).then((book) => {
            if(!this.isNewBook(book) ){
                let books = this.state.bookList.slice();
                let index = books.findIndex((b) => b.id === book.id);
                books.splice(index,1);
                books.push(book);
                this.setState({bookList: books});
            }
            else{
                let books = this.state.bookList.slice();
                books.push(book);
                this.setState({bookList: books});
            }
        });
    }


    /**
    * @description this functions takes in a book object and returns if it is already in app state or a new book 
    * @param {object} newBook - the book object
    */
    isNewBook = (newBook) => {
        if(this.state.bookList.length > 0) {
            let temp = this.state.bookList.slice().filter((book) => book.id === newBook.id  );
            return temp.length > 0 ? false: true;
        }
        else{
            return true;
        }
    }

    /**
    * @description this functions gets invoked after component is mounted, and it will download the books from api
    */
    downloadTheBooks = () => {

        BooksAPI.getAll().then((books) => {

            let temp = books === undefined ? [] : books.slice();
            temp = temp.filter((book) => this.isNewBook(book)).slice();
            let prevBooks = this.state.bookList.slice();
            prevBooks = prevBooks.concat(temp);
            this.setState( {bookList: prevBooks} );

        });
    }

    render(){

        return(

            <div>
                <Route exact path="/" render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                        <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                        <div>
                        {
                            this.state.bookShelves.slice().filter((s) => s !== "none").map(
                                (bookShelf, index)=> (
                                    <BookList key={index+1} 
                                        bookshelf={bookShelf} 
                                        shelves={this.state.bookShelves.slice()} 
                                        updateBookList={this.updateBookList} 
                                        books={this.state.bookList.slice()} />
                                )
                            )
                        }
                        </div>
                        </div>

                        <div className="open-search">
                            <Link to="/search" >Add a book</Link>
                        </div>
                    </div>
                )}/>

                <Route exact path="/search" render={ ({history}) => (
                    <SearchPage 
                        bookShelves={this.state.bookShelves.slice()} 
                        bookList={this.state.bookList.slice()} 
                        updateBookList={this.updateBookList} />
                )}/>
            </div>

        );
    }
}

export default App;