"use strict";

$(document).ready(function(){
    // Accordian from jQuery UI
    $("#reading-tools").accordion({
        collapsible: true,
        heightStyle: "content"
    });
    
    const url = "https://www.googleapis.com/books/v1/volumes?q=popular+books&maxResults=10";

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
                infinite: true,
                touchMove: true,
                prevArrow: '<button type="button" class="slick-prev custom-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>',
                nextArrow: '<button type="button" class="slick-next custom-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg></button>'
            });
        });
    }
    // check local storage to see if there is already a value stored
    if(!localStorage.getItem("readingList")){
        localStorage.setItem("readingList", JSON.stringify({}));
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

        let savedBooks = localStorage.getItem("readingList");
        if (!savedBooks) return;
        try{
            savedBooks = JSON.parse(savedBooks);
            Object.values(savedBooks).forEach(book => {
                const bookListItem = `<li>
                                    <img src="${book.thumbnail}" alt="${book.title}"/>
                                    <span>${book.title}</span>
                                    </li>`;
                readingListContainer.append(bookListItem);
            });
        }catch(e){
            console.error("Error parsing readingList from localStorage", e);
        }
    }
    // Error Messages
    function showError(message) {
        $("#book-details").html(`<p class="error">${message}</p>`);
    }
    // Random Book Generating function from the Genre Section
    function randomBookGenre(genre){
        const apiKey = "AIzaSyA84hX77WlQiUgQEbnDYGEI_Fnmh0H8-bI";
        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&key=${apiKey}`;

        $.get(url).done(function(data){
                if (data.items && data.items.length > 0) {
                    const randomBook = data.items[Math.floor(Math.random() * data.items.length)];
                    displayBookDetails(randomBook);
                } else {
                    showError("No books found for this genre.");
                }
            }).fail(function (jqHXR, errorThrown){
                showError("Could not fetch data from Google Books API. Please try again");
                console.error("Error details: ", errorThrown);
            });
    }

    function displayBookDetails(book) {
        const bookInfo = book.volumeInfo;
        const bookTitle = bookInfo.title;
        const bookAuthors = bookInfo.authors.join(",");
        const bookDescription = bookInfo.description;
        const bookThumbnail = bookInfo.imageLinks?.thumbnail;

        // displaying the book
        let bookDetailsHtml = "";
        
        if (bookThumbnail) {
            bookDetailsHtml += `<img src="${bookThumbnail}" alt="${bookTitle}" class="book-thumbnail" />`;
        }
        
        bookDetailsHtml +=  `<h4>${bookTitle}</h4>
                            <p>by ${bookAuthors}</p>
                            <p>${bookDescription}</p>`;
        
        $("#book-details").html(bookDetailsHtml);
        // remove hidden class
        $("#random-book").removeClass("hidden");
    }

    // Event Listener for save button in the reading list
    $(document).on("click", ".save-book", function(){
        const bookElement = $(this).closest(".book");
        const bookData = bookElement.data("book");
        saveBook(bookData);
    });

    // Event Listener for clicking on the genre card
    $(document).on("click", ".genre-card", function(){
        const genre = $(this).data("genre");
        console.log("Genre clicked:", genre);
        randomBookGenre(genre);
    });


    loadBooks();
    loadReadingList();
});