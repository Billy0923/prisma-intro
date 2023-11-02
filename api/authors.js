const router = require('express').Router()
module.exports = router;
const prisma = require('../prisma')

//GET /authors - returns an array of all authors
router.get('/',async(req, res,next)=>{
    try {
        const authorsArray= await prisma.author.findMany()
        res.send(authorsArray)
        // There three ways return the same result after testing
        // 1: res.send(authorsArray)
        // 2: res.json(authorsArray)
        // 3: res.send(JSON.stringify(authorsArray))
        // do not do res.json(JSON.stringify(authorsArray)), the result is hard to read

    } catch (error) {
        next();
    }
})
// use for test purpose
// router.get('/', (req,res)=>{
//     res.send("done")
// })

//POST /authors - creates a new author with the information provided in the request body

// need help to see how to make a body post in Insomnia
router.post('/', async(req, res, next)=>{
    try {
        // I did query instead of body because I tested query
        const {name} = req.body
        //console.log(name)
        if(name === null){
            // error is an obj
            const error = {
                status: 400,
                message: 'Author must have a name',
            };
            return next(error)
        }
        const author= await prisma.author.create({ data: {name}})
        res.json(author)
    } catch (error) {
        next()
    }
});

//GET /authors/:id - returns a single author with the specified id
router.get('/:id',async(req, res,next)=>{
    try {
        const authorId = parseInt(req.params.id);
        //after console.log it out, we know the number is right
        // but the type is string, so we need to make it int
        
        console.log(authorId)
        
        const author= await prisma.author.findUnique({
            where: {
                id: authorId
            },
        })
        
        if(author === null){
            // error is an obj
            const error = {
                status: 400,
                message: 'Can not find this author in our database',
            };
            return next(error)
        }
        res.send(author)
    } catch (error) {
        next();
    }
})

//PUT /authors/:id - overwrites the author with the information provided in the request body
// my understanding is, if this author id is 18, and I can overwrite it to be 22
// but looks like the project actually want to keep the id not change, and just update the name
// so this function is designed to update the author name with id remains the same
router.put('/:id' , async (req,res,next) => {
    try {
        const authorId = parseInt(req.params.id)
        const authorExist = await prisma.author.findUnique({ where: {id: authorId}});
        console.log(authorExist)
        if(authorExist === null){
            return next({
                status: 404,
                message: `this user does not exist`
            })
        }else{
            const {name} = req.body
            if(!name){
                return next({
                    status: 400,
                    message: 'author shall have a name'
                })
            }
            const newAuthor = await prisma.author.update({
                where: {id: authorId},
                data: {
                    name: name
                }
            })
            res.send(newAuthor)
        }
    } catch (error) {
        next()
    }

    // my understanding is, if this author id is 18, and I can overwrite it to be 22
    // try {
    //     const authorId = parseInt(req.params.id);
    //     const {newId} = req.body;
    //     // check if the newId already exist
    //     const authorExist= await prisma.author.findUnique({
    //         where: {
    //             id: newId
    //         },
    //     })
        
    //     if(authorExist===null){
    //         const author =await prisma.author.update({
    //             where: {id: authorId},
    //             data: {id:newId}
    //         })
    //     }else{
    //         res.send(`user with ${newId} already exist`)
    //     }
        
    // } catch (error) {
    //     next();
    // }
})

//DELETE /authors/:id - deletes the author with the specified id
// tested, working okay
router.delete('/:id', async(req, res, next) => {
    try {
        const authorId = parseInt(req.params.id);

        const authorExist = await prisma.author.findUnique({where:{id: authorId}})
        if(!authorExist){
            return next({
                status: 404,
                message: 'Could not find this author to delete'
            })
        }
        await prisma.author.delete({
            where:{id: authorId}
        })
        res.send('deleted')
    } catch (error) {
        next();
    }
})

// GET /authors/:id/books - get all books written by the specified author
router.get('/:id/books', async (req, res, next ) => {
    try {
        const inputId = parseInt(req.params.id);
        // we will get books from book table, where authorId= inputId
        const books = await prisma.book.findMany({
            where: {authorId: inputId}
        })
        

        if(books.length === 0){
            res.send('no book found that is written by this author')
        }else{
            // instead of return books, which is an array of obj
            // I decided to return just array of the book name
            const titlesArray = books.map((book)=>book.title)
            res.json(titlesArray)
        }
        
    } catch (error) {
        next()   
    }
})

// POST /authors/:id/books - 
// creates a new book as provided in the request body with the specified author

router.post('/:id/books', async (req, res, next ) => {
    try {
        const inputId = parseInt(req.params.id);

        //validate request body
        const { title } = req.query;
        //console.log(title)
        if(!title){
            return next({
                status: 400,
                message: 'Book shall have a title'
            })
        }
        // we need to update the book array inside author table
        // and also add an item inside book table
        
        const newBook = await prisma.book.create({
            data: {
                title: title,
                author: {connect:{id: inputId}}
            }
        })
        console.log(`Added book with title: ${title} to author with ID: ${inputId}`)
        res.json(newBook)
    } catch (error) {
        console.error(`Error adding book to author: ${error.message}`)
    } finally {
        await prisma.$disconnect()
    }
})