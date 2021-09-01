// DIVs
const addBook = document.querySelector('.addBook');
const bookForm = document.querySelector('.bookForm');
const bookFormHeader = document.querySelector('.bookForm >h2');
const cancel = document.querySelector('#cancel');
const submit = document.querySelector('#submit');

// Form Data Inputs
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const pages = document.querySelector('#pages');
const read = document.querySelector('#readBook')
const error = document.querySelector('#error');

// Array Book
let books = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

showBooks();

addBook.addEventListener('click', () => {
    bookForm.style.display = 'block';
    bookFormHeader.textContent = 'Add Book';
    submit.value = 'add Book';
    error.style.display = 'none';
});

cancel.addEventListener('click', () => {
    bookForm.style.display = 'none';
});

submit.addEventListener('click', () => {
    if (submit.value == 'add Book') {
        addBookToLibrary('add');
    }
    if (submit.value == 'edit Book') {
        addBookToLibrary('edit');
    }
});

//////////////////////////////////////////////////////
//      Click Events => edit, delete, read book     //
//////////////////////////////////////////////////////

window.addEventListener('click', (e) => {
    let element = e.target;

    function getId() {
        let id = element.getAttribute('id');
        id = id.charAt(id.length - 1);
        return id;
    }


    function storeLocal(array) {
        localStorage.setItem('bookshelfBook', JSON.stringify(array));
    }

    // Buch löschen
    if (element.classList.contains('delete-book')) {
        id = getId();
        books.splice(id, 1);

        storeLocal(books);

        /*
        removeElement = element.parentElement.parentElement;
        // removeElement.remove();

        let testId = Array.from(removeElement.parentNode.children).indexOf(removeElement);

        console.log(testId);
        */

        createHTML();
    }

    // Status gelesen ändern
    if (element.classList.contains('read-book')) {
        id = getId();
        if (books[id].read == 'true') {
            books[id].read = 'false';
        } else {
            books[id].read = 'true';
        }
        storeLocal(books);
        createHTML();
    }

    // Buch bearbeiten
    if (element.classList.contains('edit-book')) {
        id = getId();
        bookForm.style.display = 'block';

        bookFormHeader.textContent = 'Edit Book';
        submit.value = 'edit Book';

        title.value = books[id].title;
        author.value = books[id].author;
        pages.value = books[id].pages;

        if (books[id].read == 'true') {
            read.checked = true;
        } else {
            read.checked = false;
        }
    }
});


function addBookToLibrary(type) {

    if (title.value != '' && author.value != '' && pages.value != '') {

        // neues Buch hinzufügen
        if (type == 'add') {
            let newBook = new Book;
            newBook.title = title.value;
            newBook.author = author.value;
            newBook.pages = pages.value;
            if (read.checked) {
                newBook.read = 'true';
            } else {
                newBook.read = 'false';
            }
            books.push(newBook);

            bookForm.style.display = 'none';

            localStorage.setItem('bookshelfBook', JSON.stringify(books));

            showBooks();
        }

        // Buch editieren
        if (type == 'edit') {
            books[id].title = title.value;
            books[id].author = author.value;
            books[id].pages = pages.value;

            if (read.checked) {
                books[id].read = 'true';
            } else {
                books[id].read = 'false';
            }
            bookForm.style.display = 'none';

            localStorage.setItem('bookshelfBook', JSON.stringify(books));

            createHTML();
        }

    } else {
        error.style.display = 'block';
    }


}

function showBooks() {
    createHTML();
}

function createHTML() {
    // DIV where HTML elements will get into
    const booksContainer = document.querySelector('.books');

    let retrievedData = localStorage.getItem('bookshelfBook');
    books = JSON.parse(retrievedData);

    booksContainer.innerHTML = '';

    // create HTML Elements
    for (let i = 0; i < books.length; i++) {

        // <div> with Classname 'bookItem'
        let bookItem = document.createElement('div');
        bookItem.classList.add('bookItem');

        // <h2> Title
        let h2Tag = document.createElement('h2');
        h2Tag.textContent = books[i].title;
        bookItem.appendChild(h2Tag);

        // <p> Author
        let pTagAuthor = document.createElement('p')
        pTagAuthor.textContent = books[i].author;
        bookItem.appendChild(pTagAuthor);

        // <p> Pages
        let pTagPages = document.createElement('p');
        pTagPages.textContent = 'Pages: ' + books[i].pages;
        bookItem.appendChild(pTagPages);

        // <p> Read
        let pTagRead = document.createElement('p');
        pTagRead.textContent = 'Read: ' + books[i].read;
        bookItem.appendChild(pTagRead);

        if (books[i].read == 'false') {
            pTagRead.classList.add('red');
        } else {
            pTagRead.classList.add('green');
        }

        /////////////////////////////////////////////////////////////
        //      Icons: Edit * Delete *  Change Status Read         //
        /////////////////////////////////////////////////////////////

        // <p> Icons + Add class
        let pTagIcons = document.createElement('p');
        pTagIcons.classList.add('icons');

        // <i> Edit Icon + Add class + id
        iTagEdit = document.createElement('i');
        iTagEdit.classList.add('fas', 'fa-edit', 'edit-book');
        iTagEdit.id = 'edit-' + i;
        pTagIcons.appendChild(iTagEdit);

        // <i> Trash Icon + Add class + id
        iTagTrash = document.createElement('i');
        iTagTrash.classList.add('fas', 'fa-trash', 'delete-book');
        iTagTrash.id = 'trash-' + i;
        pTagIcons.appendChild(iTagTrash);

        // <i> Read Icon + Add class + id
        iTagRead = document.createElement('i');
        iTagRead.classList.add('fas', 'fa-book-open', 'read-book');
        iTagRead.id = 'read-' + i;
        pTagIcons.appendChild(iTagRead);

        bookItem.appendChild(pTagIcons);

        booksContainer.appendChild(bookItem);
    }
}
