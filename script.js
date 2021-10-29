const mainForm = document.querySelector("#create-book-form");
const enterAuthor = document.querySelector("#enter-author");
const enterTitle = document.querySelector("#enter-title");
const enterPages = document.querySelector("#enter-pages");
const enterReadState = document.querySelector("#enter-read-state");
const enterSubmit = document.querySelector("#enter-submit");
const deleteAllButton = document.querySelector("#delete-all");
const allBooksContainer = document.querySelector("#all-books-container");
const enterFields = [
  mainForm,
  enterAuthor,
  enterTitle,
  enterPages,
  enterReadState,
  enterSubmit,
];
let currNum = 1;

const bookModule = (function () {
  function Book(title, author, pages, readState) {
    (this.title = title),
      (this.author = author),
      (this.pages = pages),
      (this.readState = readState);
  }

  Book.prototype.createBook = function (number = false) {
    const bookContainer = document.createElement("div");
    bookContainer.classList.add("book");

    for (let property in this) {
      if (this.hasOwnProperty(property)) {
        if (property != "readState") {
          const element = document.createElement("p");
          element.classList.add(property);
          element.textContent = this[property];
          if (property == "pages") {
            element.textContent += " стр.";
          }
          bookContainer.appendChild(element);
        } else {
          const readStateButton = document.createElement("button");
          readStateButton.setAttribute("data-read", this[property]);
          readStateButton.addEventListener("click", changeReadState);
          readStateButton.classList.add("read-state-button");
          if (this[property] == "true") {
            readStateButton.textContent = "Прочитано!";
          } else {
            readStateButton.textContent = "Не прочитано";
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
  };

  function changeReadState(e) {
    if (e.target.getAttribute("data-read") == "true") {
      e.target.setAttribute("data-read", "false");
      e.target.textContent = "Не прочитано";
    } else {
      e.target.setAttribute("data-read", "true");
      e.target.textContent = "Прочитано!";
    }
    let bookNumber = e.target.parentElement.getAttribute("data-book-number");
    let tmp = JSON.parse(localStorage.getItem(bookNumber));
    tmp.readState = e.target.getAttribute("data-read");
    localStorage.setItem(bookNumber, JSON.stringify(tmp));
    console.log(localStorage);
  }

  function deleteBook(e) {
    localStorage.removeItem(
      e.target.parentElement.getAttribute("data-book-number")
    );
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
    let res = [];
    for (let x in obj) {
      if (obj.hasOwnProperty(x)) {
        res.push(x);
      }
    }
    return res;
  }

  return { Book, changeReadState, deleteAllBooks, getKeys };
})();

const formValidation = (function () {
  function mainTest() {
    return authorFieldTest() && titleFieldTest() && pagesFieldTest();
  }

  function authorFieldTest() {
    const symbTestVar = /[A-Za-zА-Яа-яЁё]/;
    const lengthTestVar = /.{5,15}/;
    if (!symbTestVar.test(enterAuthor.value)) {
      renderError("Author name should be written with letters.");
      return false;
    } else if (!lengthTestVar.test(enterAuthor.value)) {
      renderError("Author name should be from 5 to 15 symbols length.");
      return false;
    } else {
      return true;
    }
  }

  function titleFieldTest() {
    const symbTestVar = /[A-Za-zА-Яа-яЁё0-9!?,.;:]/;
    const lengthTestVar = /.{5,25}/;
    if (!symbTestVar.test(enterTitle.value)) {
      renderError("Title should be written with correct symbols.");
      return false;
    } else if (!lengthTestVar.test(enterTitle.value)) {
      renderError("Title should be from 5 to 25 symbols length.");
      return false;
    } else {
      return true;
    }
  }

  function pagesFieldTest() {
    const symbTestVar = /[0-9]/;
    if (!symbTestVar.test(enterPages.value)) {
      renderError("Pages amount should be entered using digits.");
      return false;
    } else if (enterPages.value > 99999 || enterPages.value < 0) {
      renderError("Pages amount should be less than 99999 and greater than 0.");
      return false;
    } else {
      return true;
    }
  }

  function renderError(errorMsgText) {
    const errorContainer = document.getElementById("error-container");
    const errorMsgElement = document.getElementById("error-msg");
    const closeErrorBtn = document.getElementById("close-error-btn");
    const pageWrapper = document.getElementById("page-wrapper");

    errorContainer.classList.add("visible");
    pageWrapper.classList.add("visible");
    errorMsgElement.textContent = errorMsgText;

    closeErrorBtn.addEventListener("click", () => {
      errorContainer.classList.remove("visible");
      pageWrapper.classList.remove("visible");
    });
  }

  return { mainTest };
})();

deleteAllButton.addEventListener("click", bookModule.deleteAllBooks);

enterSubmit.addEventListener("click", () => {
  if (!formValidation.mainTest()) return;
  let newBook = new bookModule.Book(
    enterTitle.value,
    enterAuthor.value,
    enterPages.value,
    enterReadState.checked
  );
  newBook.createBook();
});

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

let storageKeys = bookModule.getKeys(localStorage);

if (storageKeys.length) {
  let storageKeysCopy = [...storageKeys];
  storageKeysCopy.sort();
  for (let key of storageKeysCopy) {
    let tmp = JSON.parse(localStorage.getItem(key));
    let book = new bookModule.Book(
      tmp.title,
      tmp.author,
      tmp.pages,
      tmp.readState
    );
    book.createBook(key);
  }
}
