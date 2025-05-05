"use strict";

$(document).ready(function(){
    const url = "https://www.googleapis.com/books/v1/volumes?q=bestsellers&maxResults=10";

    // loading books from google books API
    function loadBooks() {
        $.getJSON(url, function(data){
            const books = data.items;
            books.forEach(book => {
                const info = book.volumeInfo;
                const title = info.title;
                const thumbnail = info.imageLinks?.thumbnail;
                const id = book.id;

                // Making the book elements through jQuery
                const bookElement = $(`<div class="book">
                                        <img src="${thumbnail}" alt="${title}"/>
                                        <p>${title}</p>
                                        <button class="save-book">Save</button> 
                                    </div>`);
                
                // Book data object to memory
                bookElement.data("book", {id, title, thumbnail});

                // append the book to the carousel
                $(".carousel").append(bookElement);
            });

            // Slick Carousel 
            $(".carousel").slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: true,
                infinite: true
            });
        });
    }

    // Saving to Reading list in local storage
    function saveBook(bookData){
        let savedBooks = JSON.parse(localStorage.getItem("readingList"));
        savedBooks[bookData.id] = {
            title: bookData.title,
            thumbnail: bookData.thumbnail
        };
        localStorage.setItem("readingList", JSON.stringify(savedBooks));
        loadReadingList();
    }

    // load the Reading List from local Storage
    function loadReadingList(){
        const readingListContainer = $("#reading-list-container");
        readingListContainer.empty();

        const savedBooks = JSON.parse(localStorage.getItem("readingList"));
        Object.values(savedBooks).forEach(book => {
            const bookListItem = `<li>
                                <img src="${book.thumbnail}" alt="${book.title}"/>
                                <span>${book.title}</span>
                                </li>`;
            readingListContainer.append(bookListItem);
        });
    }

    // Event Listener for save button
    $document.on("click", ".save-book", function(){
        const bookElement = $(this).closest(".book");
        const bookData = bookElement.data("book");
        saveBook(bookData);
    });

    // loadBooks();
    // renderReadingList();
});