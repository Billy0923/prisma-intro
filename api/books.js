const router = require('express').Router()
module.exports = router;

const prisma = require('../prisma')

// GET /books - returns an array of all books
router.get('/', async(req, res, next) =>{
    try {
        const books = await prisma.book.findMany()
        res.json(books)
    } catch (error) {
        next();
    }
});

// GET /books/:id - returns a single book with the specified id
router.get('/:id', async (req, res, next) => {
    const inputId = parseInt(req.params.id)
    try {
        const book = await prisma.book.findUnique({
            where: {
                id: inputId
            }
        })
        if(book ===null){
            return next({
                status: 404,
                message: `Could not find this book with id: ${inputId}`
            })
        } else {
            res.send(book)
        }
        
    } catch (error) {
        next()
    }
})

// PUT /books/:id - overwrites the book 
// with the information provided in the request body

router.put('/:id', async (req, res, next)=>{
    //const inputId = parseInt(req.params.id);
    // parseInt is more readable, but it is slower because it involves function call and additional parsing logic

    // + might be slightly faster, but it may not handle all edge cases correctly.
    // for example, empty string will become 0
    const inputId = +req.params.id;

    try {
        const {title:newTitle}= req.body
        // when you do {title}it has to be title, if you do newTitle, it will be undefined
        // you could also do  const {title:newTitle}= req.body
        console.log(newTitle)
        if(newTitle === undefined){
            return next({
                status: 400,
                message: 'book shall have a title to update'
            })
        }

        //the line below will cause  Cannot PUT /api/books/6
        const book = await prisma.book.findUnique({
            where: {
                id: inputId
            }
        })
        console.log(book)
        if(book === null){
            return next({
                status:404,
                message: `Could not find this book with id: ${inputId}`
            })
        }else {
            const newBook = await prisma.book.update({
                where: {id: inputId},
                data: {title: newTitle}
            })
            res.send(newBook)
        }
        
    } catch (error) {
        next()
    }
})

//DELETE /books/:id - deletes the book with the specified id
router.delete('/:id' , async (req, res, next) => {
    const inputId = +req.params.id
    
    try {
        const book = await prisma.book.findUnique({
            where: {
                id: inputId
            }
        })
        if(book ===null){
            return next({
                status: 404,
                message: `Could not find this book with id: ${inputId}`
            })
        } else {
            const deletedBook = await prisma.book.delete({ where: {id: inputId}})
            console.log(`deleted book with book id = ${inputId}`)
            res.send(`book with book id = ${inputId} has been deleted`)
        }
          
    } catch (error) {
        next()
    }
})