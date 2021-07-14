function Book(title, author, pages, readState) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.readState = readState
}

Book.prototype.createBook = function(number=false) {
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("book");

    for (let property in this) {
        if (this.hasOwnProperty(property)) {
            if (property != "readState") {
                const element = document.createElement("p");
                element.classList.add(property);
                element.textContent = this[property];
                if (property == "pages") {
                    element.textContent += " стр."
                }
                bookContainer.appendChild(element);
            } else {
                const readStateButton = document.createElement("button");
                readStateButton.setAttribute("data-read", this[property]);
                readStateButton.addEventListener("click", changeReadState);
                readStateButton.classList.add("read-state-button");
                if (this[property] == "true") {
                    readStateButton.textContent = "Прочитано!"
                } else {
                    readStateButton.textContent = "Не прочитано"
                }
                bookContainer.appendChild(readStateButton);
            }
        }
    }

    const deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", deleteBook);
    deleteButton.textContent = "Удалить";
    deleteButton.classList.add("delete-button");
    bookContainer.appendChild(deleteButton);

    for (let field of enterFields) {
        field.checked = false;
        field.value = "";
    }
    
    let bookNumber;
    if (number) {
        bookNumber = number;
    } else {
        bookNumber = currNum;
    }
    currNum += 1;
    localStorage.setItem(bookNumber, JSON.stringify(this));
    bookContainer.setAttribute("data-book-number", bookNumber);

    allBooksContainer.appendChild(bookContainer);
}

function changeReadState(e) {
    if (e.target.getAttribute("data-read") == "true") {
        e.target.setAttribute("data-read", "false");
        e.target.textContent = "Не прочитано";
    } else {
        e.target.setAttribute("data-read", "true");
        e.target.textContent = "Прочитано!";
    }
    let bookNumber = e.target.parentElement.getAttribute("data-book-number")
    let tmp = JSON.parse(localStorage.getItem(bookNumber));
    tmp.readState = e.target.getAttribute("data-read");
    localStorage.setItem(bookNumber, JSON.stringify(tmp));
    console.log(localStorage);
}

function deleteBook(e) {
    localStorage.removeItem(e.target.parentElement.getAttribute("data-book-number"));
    allBooksContainer.removeChild(e.target.parentElement);
}

function deleteAllBooks(e) {
    if (confirm("Вы точно хотите удалить все книги?")) {
        const books = document.querySelectorAll(".book");
        for (let book of books) {
            allBooksContainer.removeChild(book);
        }
    }
    localStorage.clear();
    currNum = 1;
}

function getKeys(obj) {
    res = [];
    for (let x in obj) {
        if (obj.hasOwnProperty(x)) {
            res.push(x);
        }
    }   
    return res;
}

const mainForm = document.querySelector("#create-book-form");
const enterAuthor = document.querySelector("#enter-author");
const enterTitle = document.querySelector("#enter-title");
const enterPages = document.querySelector("#enter-pages");
const enterReadState = document.querySelector("#enter-read-state");
const enterSubmit = document.querySelector("#enter-submit");
const deleteAllButton = document.querySelector("#delete-all");
const allBooksContainer = document.querySelector("#all-books-container");
const enterFields = [mainForm, enterAuthor, enterTitle, enterPages, enterReadState, enterSubmit];
let currNum = 1;

deleteAllButton.addEventListener("click", deleteAllBooks);

mainForm.addEventListener("submit", (e) => {
    let newBook = new Book(enterTitle.value, enterAuthor.value, enterPages.value, enterReadState.checked);
    newBook.createBook();
    e.preventDefault();
})

if (getKeys(localStorage).length) {
    for (let key of getKeys(localStorage)) {
        let tmp = JSON.parse(localStorage.getItem(key));
        let book = new Book(tmp.title, tmp.author, tmp.pages, tmp.readState);
        book.createBook(key);
    }
}
