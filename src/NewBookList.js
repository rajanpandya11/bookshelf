import React, { Component } from "react";

class NewBookList extends Component  {

    state = {
        newOption: '',
        oldOption: '',
        newBook: true,
        bookTitle: '',
        bookId: '',
        value: 'a'
    }

    render(){
        const { books, options, moveTheBook } = this.props;
    
        const handleChange = (event, bookid, title) => {
            console.log('event object for clicking after new option: ', event);        
            this.setState({newOption:event.target.value, bookId: bookid, bookTitle: title}, () => {
                moveTheBook(this.state);
            });
            
        }
        
        return (
            <div className="bookshelf">            
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
                                        <select onChange={(e) => handleChange(e, book.id, book.title )} value={this.state.value} >
                                            <option disabled value="a"> -- select an option -- </option>
                                            {options.map((book_option, option_item)=> {
                                                const some = Math.floor((option_item+Math.random()*100)*Math.random()*100);                                                
                                                return(
                                                        <option key={some} value={book_option} > {book_option} </option>
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

export default NewBookList;
