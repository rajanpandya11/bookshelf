import React, { Component } from "react";

class BookList extends Component {

    state = {
        newOption: '',
        oldOption: '',
        newBook: false,
        bookTitle: '',
        bookId: ''
    }

    render(){

        const { bookshelfTitle, books, options, moveTheBook  } = this.props;

        const handleChange = (newOption, bookid, oldOption, title) => {
            this.setState({newOption:newOption, oldOption: oldOption, bookId: bookid, bookTitle: title }, () => {
                moveTheBook(this.state);
            });
            
        }

        return (
            <div className="bookshelf">            
                <h2 className="bookshelf-title">{bookshelfTitle}</h2> 
                <div className="bookshelf-books">
                    { ( books !== null && books !== undefined ) &&
                    <ol className="books-grid">
                        {books.map((book, item) => {
                            const someKey = Math.floor((item+Math.random()*100)*Math.random()*100);
                            const imagelink = book.imageLinks !== undefined ? book.imageLinks['thumbnail'] : '';
                            return  (  <li key={someKey}>
                                <div className="book">
                                    <div className="book-top">
                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + imagelink + ')' }}></div>
                                    <div className="book-shelf-changer">
                                        <select onChange={(e) => handleChange(e.target.value, book.id, bookshelfTitle, book.title)} value={this.state.value}>
                                            {options.map((book_option, option_item)=> {
                                                const some = Math.floor((option_item+Math.random()*100)*Math.random()*100);                                                
                                                return(
                                                    bookshelfTitle !== book_option && 
                                                        <option key={some} value={book_option}> {book_option}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div className="book-authors">{book.author}</div>
                                </div>
                                </li>
                            );
                        })}
                    </ol> }
                </div>
            </div>
        );
    }

} 

export default BookList;

//  props.bookshelfTitle = Currently Reading

// <option value="move" disabled>Move to...</option>
// <option value="currentlyReading">Currently Reading</option>
// <option value="wantToRead">Want to Read</option>
// <option value="read">Read</option>
// <option value="none">None</option>