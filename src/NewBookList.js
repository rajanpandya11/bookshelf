import React from "react";

const NewBookList = (props) => {
    const { books, options } = props;
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
                                    <select>
                                        {options.map((book_option, option_item)=> {
                                            const some = Math.floor((option_item+Math.random()*100)*Math.random()*100);                                                
                                            return(
                                                    <option key={some} value={book_option.value}> {book_option.value}</option>
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

export default NewBookList;
