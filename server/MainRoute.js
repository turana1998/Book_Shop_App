const express = require('express')
const router=express.Router();
const usersctrl=require('./controllers/UsersController');
const commonctrl=require('./controllers/CommonController');
const uploadctrl=require('./controllers/UploadController');
const categoriesctrl=require('./controllers/CategoriesController');
const booksctrl=require('./controllers/BooksController');
const writersctrl=require('./controllers/WritersController');


//users
router.get('/users',usersctrl.getUsers);
router.post('/users',usersctrl.addUser);
router.get('/users/:userId',usersctrl.getById);
router.put('/users/:userId',usersctrl.update);
router.delete('/users/:userId',usersctrl.deleteUser);

//writers
router.get('/writers',writersctrl.getWriters);
router.post('/writers',writersctrl.addWriter);
router.get('/writers/:writerrId',writersctrl.getById);
router.put('/writers/:writerId',writersctrl.update);
router.delete('/writers/:writerId',writersctrl.deleteWriter);

//roles
router.get('/roles',commonctrl.getRoles);

//categories
router.get('/categories',categoriesctrl.getCategories);
router.post('/categories',categoriesctrl.addCategory);
router.delete('/categories/:categoryId',categoriesctrl.deleteCategory);

//books
router.get('/books',booksctrl.getBooks);
router.post('/books',booksctrl.addBook);
router.put('/books/:bookId',booksctrl.updateBook);
router.get('/books/:bookId',booksctrl.getBookById);
router.delete('/books/:bookId',booksctrl.deleteBook);


//file upload
router.post('/upload/user',uploadctrl.uploadAvatar)
router.post('/upload/book',uploadctrl.uploadBookImg)
router.post('/upload/writer',uploadctrl.uploadWriterImg)


module.exports=router;




