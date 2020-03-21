import React from "react";

const BookList = (props) => {
    const {bookshelfTitle, books, options } = props;
    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{bookshelfTitle}</h2> 
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {books.map((book, item) => {
                        const someKey = Math.floor((item+Math.random()*100)*Math.random()*100);
                        return  (  <li key={someKey}>
                            <div className="book">
                                <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url("http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73-GnPVEyb7MOCxDzOYF1PTQRuf6nCss9LMNOSWBpxBrz8Pm2_mFtWMMg_Y1dx92HT7cUoQBeSWjs3oEztBVhUeDFQX6-tWlWz1-feexS0mlJPjotcwFqAg6hBYDXuK_bkyHD-y&source=gbs_api")' }}></div>
                                <div className="book-shelf-changer">
                                    <select>
                                        {options.map((book_option, option_item)=> {
                                            const some = Math.floor((option_item+Math.random()*100)*Math.random()*100);                                                
                                            return(
                                                bookshelfTitle !== book_option.value && 
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
                </ol>
            </div>
        </div>
    );
} 

export default BookList;

//  props.bookshelfTitle = Currently Reading

// <option value="move" disabled>Move to...</option>
// <option value="currentlyReading">Currently Reading</option>
// <option value="wantToRead">Want to Read</option>
// <option value="read">Read</option>
// <option value="none">None</option>