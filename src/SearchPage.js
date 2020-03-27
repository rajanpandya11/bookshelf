import  React, { PureComponent  } from "react";
import { Link } from "react-router-dom";
import NewBookList from './NewBookList';


class SearchPage extends PureComponent {

    render(){
        let { searchedBooks, moveOptions, moveTheBook, lookUpBooks, searchTerm } = this.props;

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
                        <input type="text" placeholder="Search by title or author" value={searchTerm} onChange={(e)=> lookUpBooks(e.target.value) }/>
                        {
                        searchedBooks.length > 0 && 
                            <NewBookList books={searchedBooks} options={moveOptions} moveTheBook={moveTheBook}/> 
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

// SearchPage.prototype = {
//     searchedBooks: PropTypes.array.isRequired, 
//     moveOptions: PropTypes.array.isRequired, 
//     moveTheBook: PropTypes.func.isRequired, 
//     lookUpBooks: PropTypes.func.isRequired, 
//     searchTerm: PropTypes.string.isRequired
// }

export default SearchPage;


