const express = require("express");
var bodyParser= require("body-parser");
//Database
const database = require("./database");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

/*
Route            /
Description      Get all the books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
booky.get("/",(req,res) => {
  return res.json({books: database.books});
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN ===  req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route            /c
Description      Get specific book on category
Access           PUBLIC
Parameter        category
Methods          GET
*/

booky.get("/c/:category", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the category of ${req.params.category}`})
  }

  return res.json({book: getSpecificBook});
});


/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/author", (req,res) => {
  return res.json({authors: database.author});
});

/*
Route            /author/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/

booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});

/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

booky.get("/publications",(req,res) => {
  return res.json({publications: database.publication});
})

//POST

/*
Route            /book/new
Description      add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/book/new", (req,res)=>{
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});
//POST

/*
Route            /author/new
Description      add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/author/new",(req,res)=>{
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json(database.author);
});

//POST

/*
Route            /publication/new
Description      add new publication
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

booky.post("/publication/new",(req,res)=>{
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});
//Put

/*
Route            /publication/update/book
Description     update or add new publication
Access           PUBLIC
Parameter        isbn
Methods          Put
*/

booky.put("/publication/update/book/:isbn", (req,res)=>{
  //update the publication database
database.publication.forEach((pub)=>{
  if(pub.id===req.body.pubId){
    return pub.books.push(req.params.isbn);
  }
});
//updated the book Database
database.books.forEach((book)=>{
  if(book.ISBN===req.params.isbn){
    book.publication= req.body.pubId;
    return;
  }
});

return res.json({
  books: database.books,
  publications: database.publication,
  message: "successfully updated publication"
});
});

//delete
/*
Route           /book/delete
Description     delete book
Access           PUBLIC
Parameter        isbn
Methods          delete
*/

booky.delete("/book/delete/:isbn", (req,res)=>{
  //whichever book that does not match with isbn just send it to an updatedBookDatabase array
  //and rest will be filtered out
  const updatedBookDatabase=database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books =updatedBookDatabase;
  return res.json({books: database.books});
});

//delete
/*
Route           /book/delete/author
Description     delete author from book and related book from the author
Access           PUBLIC
Parameter        isbn
Methods          delete
*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
  //update the book database
database.books.forEach((book)=>{
  if(book.ISBN=== req.params.isbn){
    const newAuthorList = book.author.filter(
      (eachAuthor)=> eachAuthor !== parseInt(req.params.authorId)
    );
    book.author =newAuthorList;
    return;
  }
});

  //and  update author database
  database.author.forEach((eachAuthor)=>{
    if(eachAuthor.id=== parseInt(req.params.authorId)){
    const newBookList =eachAuthor.books.filter(
      (book)=> book !== req.params.isbn
    );
    eachAuthor.books = newBookList;
    return;
    }
  });
return res.json({
  books: database.books,
  author: database.author,
  message: "author is deleted"
});
});


booky.listen(3000,() => {
  console.log("Server is up and running");
});
