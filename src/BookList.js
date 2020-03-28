import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import Book from './Book';

class BookList extends Component{

    // constructor(props){
    //     super(props);
    // }

    componentWillMount(){
        this.getTheBooks();
    }

    getTheBooks = () =>{
        let books = this.props.books;
        let bookshelf = this.props.bookshelf;
        books = books.filter(book => book.shelf === bookshelf);
        return books;
    }

    handleChange(newShelf, book){
        BooksAPI.update(book, newShelf).then((res) => console.log(res)).then(()=> {this.props.updateBookList(book)} );
    }

    convertForAPI = (str) => {
        if(str === "none")
            return "None";
        if(str === "wantToRead")
            return "Want To Read";
        if(str === "currentlyReading")
            return "Currently Reading";
        if(str === "read")
            return "Read";
    }

    render(){
            let { shelves, bookshelf } = this.props;

            let books = this.getTheBooks();
            return(
                <div className="bookshelf">            
                    <h2 className="bookshelf-title">{this.convertForAPI(bookshelf)}</h2> 
                    <div className="bookshelf-books">
                        { ( books !== null && books !== undefined ) &&
                        <ol className="books-grid">
                            {
                                books.map((book, item) => {
                                    const imagelink = book.imageLinks !== undefined ? book.imageLinks['thumbnail'] : '';
                                    book.imagelink = imagelink;  
                                    return  (  
                                            <li key={item+1}>
                                                <Book shelves={shelves} book={book} handleChange={(a,b) => this.handleChange(a,b)} />
                                            </li>
                                    );
                                    }   
                                )
                            }
                        </ol> }
                    </div>
                </div>
            );            
    }
}

export default BookList;
