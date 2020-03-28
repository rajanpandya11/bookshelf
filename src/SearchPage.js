import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import Book from './Book';
import { Link } from 'react-router-dom';

/**
* @description this component manages and displays to /search url page
*/

class SearchPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            searchTerm: '',
            searchedBooks: []
        }
    }

    /**
    * @description this function fetches books based on given search terms
    * @param {string} query - query is what user types in to input field
    */
    handleSearch = (query) => {
        query = query.toLowerCase();
        if(query.length > 2){
            BooksAPI.search(query).then((books) => {
                if(books.length === 0) { this.setState({ searchTerm: query, searchedBooks: []}); }
                if(books && books.length > 0) {
                    this.setState({ searchTerm: query, searchedBooks: books }); 
                } 
            });
        } 
        if(query.length >= 0){
            this.setState({searchTerm: query});            
        }
    }


    /**
    * @description this function updates shelf for a book, when a new shelf is clicked from UI in book's drop down menu 
    * @param {string} newShelf - is the value for shelf key to be updated for the book object
    * @param {object} book - the book object
    */
    handleChange = (newShelf, book) => {
        BooksAPI.update(book, newShelf).then((res) => console.log(res)).then( ()=> {this.props.updateBookList(book)} );
    }

    /**
    * @description this function finds, based on a book id, whether a book is assigned a shelf, by user 
    * @param {object} book - the book object
    */
    findTheShelf = (book) => {
        this.props.bookList.some((b) => {
            if(b.id === book.id){
                book.shelf = b.shelf; 
                return true; 
            }
        });
        if(book.shelf === undefined || book.shelf === '')
            book.shelf = 'none';
        return book.shelf ;
    }

    render(){

        let { bookShelves } = this.props;

        return(
            <div className="search-books">
                <div className="search-books-bar">
                    <Link className="close-search" to="/">Close</Link>                
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author" value={this.state.searchTerm} onChange={(e) => this.handleSearch(e.target.value)}/>
                    </div>
                </div>
                <div className="search-books-results">
                    {
                        <ol className="books-grid">
                        {
                            this.state.searchedBooks.map((book, item) => {
                                const imagelink = book.imageLinks !== undefined ? book.imageLinks['thumbnail'] : '';
                                book.imagelink = imagelink;
                                book.shelf = this.findTheShelf(book);
                                return  (  
                                    <li key={item+1}>
                                        <Book 
                                            shelves={bookShelves} 
                                            book={book} 
                                            handleChange={(a,b) => this.handleChange(a,b)} />
                                    </li>
                                );
                                })
                        }
                        </ol>
                    }
                </div>
            </div>

        );
    }

}

export default SearchPage;

