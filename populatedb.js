#! /usr/bin/env node

console.log(
    'This script populates some test categories, locations, races, modalities and instances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Location = require("./models/location");
const Race = require("./models/race");
const Modality = require("./models/modality");
const Instance = require("./models/instance");

const categories = [];
const locations = [];
const races = [];
const modalities = [];
const instances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createLocations();
    await createRaces();
    await createModalities();
    await createInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// categories[0] will always be the Road Running category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
    const categorydetail = { name: name };
    if (description != false) categorydetail.description = description;

    const category = new Category(categorydetail);

    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function authorCreate(index, first_name, family_name, d_birth, d_death) {
const authordetail = { first_name: first_name, family_name: family_name };
if (d_birth != false) authordetail.date_of_birth = d_birth;
if (d_death != false) authordetail.date_of_death = d_death;

const author = new Author(authordetail);

await author.save();
authors[index] = author;
console.log(`Added author: ${first_name} ${family_name}`);
}

async function bookCreate(index, title, summary, isbn, author, genre) {
const bookdetail = {
    title: title,
    summary: summary,
    author: author,
    isbn: isbn,
};
if (genre != false) bookdetail.genre = genre;

const book = new Book(bookdetail);
await book.save();
books[index] = book;
console.log(`Added book: ${title}`);
}

async function bookInstanceCreate(index, book, imprint, due_back, status) {
const bookinstancedetail = {
    book: book,
    imprint: imprint,
};
if (due_back != false) bookinstancedetail.due_back = due_back;
if (status != false) bookinstancedetail.status = status;

const bookinstance = new BookInstance(bookinstancedetail);
await bookinstance.save();
bookinstances[index] = bookinstance;
console.log(`Added bookinstance: ${imprint}`);
}

async function createCategories() {
console.log("Adding categories");
await Promise.all([
    categoryCreate(0, "Road Running", "Road running involves racing on paved roads and is popular for events ranging from 5Ks to marathons. Participants of all levels compete, often aiming for personal bests or enjoying community races. The surfaces are usually flat and smooth, making it ideal for fast pacing and consistent running conditions. Road races are typically well-attended, with extensive support like aid stations and cheering crowds."),
    categoryCreate(1, "Trail Running", "Trail running takes place on hiking trails, mountain paths, or forest routes. It varies greatly in difficulty, often featuring challenging terrains such as hills, mud, and obstacles like roots and rocks. The focus is on the connection with nature and the physical challenges of the uneven surfaces. Trail races range from short distances to ultramarathons, attracting those who seek adventure and scenic views."),
    categoryCreate(2, "Obstacle Course Racing (OCR)", "Obstacle course racing combines running with physical challenges that test strength, endurance, and agility. Courses feature obstacles such as walls to climb, weights to carry, and mud pits to cross, often spread over varied terrains. OCR events encourage teamwork and resilience, drawing participants who enjoy intense physical engagement and camaraderie. Events vary from short sprints to longer, more demanding courses."),
]);
}

async function createAuthors() {
console.log("Adding authors");
await Promise.all([
    authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
    authorCreate(1, "Ben", "Bova", "1932-11-8", false),
    authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
    authorCreate(3, "Bob", "Billings", false, false),
    authorCreate(4, "Jim", "Jones", "1971-12-16", false),
]);
}

async function createBooks() {
console.log("Adding Books");
await Promise.all([
    bookCreate(0,
    "The Name of the Wind (The Kingkiller Chronicle, #1)",
    "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
    "9781473211896",
    authors[0],
    [genres[0]]
    ),
    bookCreate(1,
    "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
    "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
    "9788401352836",
    authors[0],
    [genres[0]]
    ),
    bookCreate(2,
    "The Slow Regard of Silent Things (Kingkiller Chronicle)",
    "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
    "9780756411336",
    authors[0],
    [genres[0]]
    ),
    bookCreate(3,
    "Apes and Angels",
    "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
    "9780765379528",
    authors[1],
    [genres[1]]
    ),
    bookCreate(4,
    "Death Wave",
    "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
    "9780765379504",
    authors[1],
    [genres[1]]
    ),
    bookCreate(5,
    "Test Book 1",
    "Summary of test book 1",
    "ISBN111111",
    authors[4],
    [genres[0], genres[1]]
    ),
    bookCreate(6,
    "Test Book 2",
    "Summary of test book 2",
    "ISBN222222",
    authors[4],
    false
    ),
]);
}

async function createBookInstances() {
console.log("Adding authors");
await Promise.all([
    bookInstanceCreate(0, books[0], "London Gollancz, 2014.", false, "Available"),
    bookInstanceCreate(1, books[1], " Gollancz, 2011.", false, "Loaned"),
    bookInstanceCreate(2, books[2], " Gollancz, 2015.", false, false),
    bookInstanceCreate(3,
    books[3],
    "New York Tom Doherty Associates, 2016.",
    false,
    "Available"
    ),
    bookInstanceCreate(4,
    books[3],
    "New York Tom Doherty Associates, 2016.",
    false,
    "Available"
    ),
    bookInstanceCreate(5,
    books[3],
    "New York Tom Doherty Associates, 2016.",
    false,
    "Available"
    ),
    bookInstanceCreate(6,
    books[4],
    "New York, NY Tom Doherty Associates, LLC, 2015.",
    false,
    "Available"
    ),
    bookInstanceCreate(7,
    books[4],
    "New York, NY Tom Doherty Associates, LLC, 2015.",
    false,
    "Maintenance"
    ),
    bookInstanceCreate(8,
    books[4],
    "New York, NY Tom Doherty Associates, LLC, 2015.",
    false,
    "Loaned"
    ),
    bookInstanceCreate(9, books[0], "Imprint XXX2", false, false),
    bookInstanceCreate(10, books[1], "Imprint XXX3", false, false),
]);
}