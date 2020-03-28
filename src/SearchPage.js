import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import Book from './Book';
import { Link } from 'react-router-dom';


class SearchPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            searchTerm: '',
            searchedBooks: []
        }
    }

    handleSearch =(event) => {
        let query = event.target.value.toLowerCase();
        if(query.length > 2){
            BooksAPI.search(query).then((books) => {
                if(books.length === 0) { this.setState({ searchTerm: query, searchedBooks: []}); }
                if(books && books.length > 0) { this.setState({ searchTerm: query, searchedBooks: books }); } 
            });
        } 
        if(query.length >= 0){
            this.setState({searchTerm: query});            
        }

    }

    getBooks = () => {
        let query = this.state.searchTerm.toLowerCase();
        if(query.length > 2){
            BooksAPI.search(query).then((books) => {
                if(books.length === 0) { this.setState({searchedBooks: []}); }
                if(books && books.length > 0) { 
                    this.setState({ searchedBooks: books }); 
                } 
            });
        }        
    }

    handleChange = (newShelf, book) => {
        BooksAPI.update(book, newShelf).then((res) => console.log(res)).then( ()=> {this.props.updateBookList(book)} );
    }

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
                        {/*
                        NOTES: The search from BooksAPI is limited to a particular set of search terms.
                        You can find these search terms here:
                        https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                        However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                        you don't find a specific author or title. Every search is limited by search terms.
                        */}
                        <input type="text" placeholder="Search by title or author" value={this.state.searchTerm} onChange={this.handleSearch}/>
                        {
                            <ol className="books-grid">
                            {
                                this.state.searchedBooks.map((book, item) => {
                                 const imagelink = book.imageLinks !== undefined ? book.imageLinks['thumbnail'] : '';
                                 book.imagelink = imagelink;
                                 book.shelf = this.findTheShelf(book);
                                 return  (  
                                     <li key={item+1}>
                                         <Book shelves={bookShelves} book={book} handleChange={(a,b) => this.handleChange(a,b)}/>
                                     </li>
                                 );
                                 })
                            }
                            </ol>
                        }
                    </div>
                    </div>
                    <div className="search-books-results">
                    <ol className="books-grid"></ol>
                </div>
            </div>

        );
    }

}

export default SearchPage;