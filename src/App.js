import React,{ Component } from "react";
import { Link, Route } from 'react-router-dom';
import * as BooksAPI from "./BooksAPI";
import './App.css'
import BookList from "./BookList";
import SearchPage from "./SearchPage";


class App extends Component{

    constructor(props){
        super(props);
        this.state = {
            bookShelves: ["none", "read", "currentlyReading", "wantToRead"],
            bookList: []
        }
    }

    componentDidMount(){
        this.downloadTheBooks();
    }


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


    isNewBook = (newBook) => {
        if(this.state.bookList.length > 0) {
            let temp = this.state.bookList.slice().filter((book) => book.id === newBook.id  );
            return temp.length > 0 ? false: true;
        }
        else{
            return true;
        }
    }

    isShelfUpdated = (book) => {
        let check1 = this.state.bookList.filter((b) => b.id === book.id);
        let check2 = check1.slice((b) => b.shelf !== book.shelf);
        if(check1.length === 1 && check2.length === 1)        {
            return true;
        }
        else{
            return false;
        }
    }

    downloadTheBooks = () => {

        BooksAPI.getAll().then((books)=> books).then((books) => {

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