const prisma = require('../prisma')
// const seed = async ()=>{
//     // create 20 authors with 3 books each
//     const authorsArray=[
//         "Jane Austen",
//         "George Orwell",
//         "Toni Morrison",
//         "J.K. Rowling",
//         "F. Scott Fitzgerald",
//         "Agatha Christie",
//         "Ernest Hemingway",
//         "Gabriel Garcia Marquez",
//         "Harper Lee",
//         "Stephen King",
//         "Maya Angelou",
//         "J.R.R. Tolkien",
//         "Leo Tolstoy",
//         "Mark Twain",
//         "Virginia Woolf",
//         "Franz Kafka",
//         "John Steinbeck",
//         "J.D. Salinger",
//         "Chinua Achebe",
//         "Salman Rushdie"
//       ];
      
//     const createAuthor = for(const i in authorsArray)
// };
const seed = async (numAuthors = 20, booksPerAuthor = 3) => {
    /*
      Array.from() is a quick way to create an array of a certain length
      and fill it with dynamically generated data.
    */
    const createAuthorPromises = Array.from({ length: numAuthors }, (_, i) => {
      const books = Array.from({ length: booksPerAuthor }, (_, j) => ({
        title: `Book ${i}${j}`,
      }));
      return prisma.author.create({
        data: {
          name: `Author ${i}`,
          book: {
            create: books,
          },
        },
      });
    });
  
    /*
      Promise.all allows us to start all the `create` requests
      at the same time, rather than waiting for each one to finish.
      We then wait for all of them to finish with `await`.
    */
    await Promise.all(createAuthorPromises);
  };

seed()
    .then(async () => await prisma.$disconnect())
    .catch(async (e)=>{
        console.error('error', e);
        await prisma.$disconnect();
        process.exit(1);
    });