const bookRepo=require('../repositories/BooksRepo');

const getBooks=(req,res)=>{
    try{
        res.send(bookRepo.getBooks(req));
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}


const addBook=(req,res)=>{
    try{
        bookRepo.addBook(req);
        res.sendStatus(201);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}

const getBookById=(req,res)=>{
    try{
        bookRepo.getBookById(req);
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}

const updateBook=(req,res)=>{
    try{
        bookRepo.updateBook(req);
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}


const deleteBook=(req,res)=>{
    try{
        bookRepo.deleteBook(req);
        res.sendStatus(201);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}

module.exports={
    getBooks,
    addBook,
    getBookById,
    deleteBook,
    updateBook
}