import React,{ PureComponent } from "react";

class Book extends PureComponent{
    render(){
        let {book, options, handleChange} = this.props;
        
        return(
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.imagelink + ')' }}></div>
                    <div className="book-shelf-changer">
                        <select onChange={(e) => handleChange(e.target.value, book )} value={book.shelf} >
                            <option disabled value="a"> -- select a shelf -- </option>
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
        );

    }
}

export default Book;