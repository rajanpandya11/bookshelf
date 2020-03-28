import React, { Component } from "react";

class Book extends Component{

    constructor(props){
        super(props);
    }

    handleChange = (event) => {
        this.props.handleChange(event.target.value, this.props.book);
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
        let { book, shelves } = this.props;
        
        return(
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: 'url(' + book.imagelink + ')' }}></div>
                    <div className="book-shelf-changer">
                        <select onChange={this.handleChange} value={book.shelf} >
                            <option disabled value="a"> -- select a shelf -- </option>
                            {shelves.map((shelf_option, shelf_item)=> {
                                return(
                                    <option key={shelf_item+1} value={shelf_option} > {this.convertForAPI(shelf_option)} </option>
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