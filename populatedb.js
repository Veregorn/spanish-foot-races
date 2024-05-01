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
const race = require("./models/race");
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

async function locationCreate(index, city, community) {
    const locationdetail = { city: city, community: community };

    const location = new Location(locationdetail);

    await location.save();
    locations[index] = location;
    console.log(`Added location: ${city} ${community}`);
}

async function raceCreate(index, name, category, description, image_url) {
    const racedetail = {
        name: name,
        category: category,
    };
    if (description != false) racedetail.description = description;
    if (image_url != false) racedetail.image_url = image_url;

    const race = new Race(racedetail);
    await race.save();
    races[index] = race;
    console.log(`Added race: ${name}`);
}

async function modalityCreate(index, race, start_location, end_location, distance, elevation, track) {
    const modalitydetail = {
        race: race,
        start_location: start_location,
        end_location: end_location,
        distance: distance,
        elevation: elevation,
        track: track,
    };

    const modality = new Modality(modalitydetail);
    await modality.save();
    modalities[index] = modality;
    console.log(`Added Modality: ${race.name} - ${distance} km`);
}

async function instanceCreate(index, modality, date, price) {
    const instancedetail = {
        modality: modality,
        date: date,
        price: price,
    };

    const instance = new Instance(instancedetail);
    await instance.save();
    instances[index] = instance;
    console.log(`Added instance: ${modality} - ${date}`);
}

async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
        categoryCreate(0, "Road Running", "Road running involves racing on paved roads and is popular for events ranging from 5Ks to marathons. Participants of all levels compete, often aiming for personal bests or enjoying community races. The surfaces are usually flat and smooth, making it ideal for fast pacing and consistent running conditions. Road races are typically well-attended, with extensive support like aid stations and cheering crowds."),
        categoryCreate(1, "Trail Running", "Trail running takes place on hiking trails, mountain paths, or forest routes. It varies greatly in difficulty, often featuring challenging terrains such as hills, mud, and obstacles like roots and rocks. The focus is on the connection with nature and the physical challenges of the uneven surfaces. Trail races range from short distances to ultramarathons, attracting those who seek adventure and scenic views."),
        categoryCreate(2, "Obstacle Course Racing (OCR)", "Obstacle course racing combines running with physical challenges that test strength, endurance, and agility. Courses feature obstacles such as walls to climb, weights to carry, and mud pits to cross, often spread over varied terrains. OCR events encourage teamwork and resilience, drawing participants who enjoy intense physical engagement and camaraderie. Events vary from short sprints to longer, more demanding courses."),
    ]);
}

async function createLocations() {
    console.log("Adding locations");
    await Promise.all([
        locationCreate(0, "Granada", "Andalucía"),
        locationCreate(1, "Valencia", "Comunidad Valenciana"),
        locationCreate(2, "Sevilla", "Andalucía"),
        locationCreate(3, "Castellón", "Comunidad Valenciana"),
        locationCreate(4, "Palas de Rei", "Galicia"),
        locationCreate(5, "Irún", "País Vasco"),
        locationCreate(6, "Guipúzcoa", "País Vasco"),
        locationCreate(7, "Benia de Onís", "Asturias"),
        locationCreate(8, "Huesca", "Aragón"),
        locationCreate(9, "La Palma", "Islas Canarias"),
        locationCreate(10, "Monzón", "Aragón"),
        locationCreate(11, "Madrid", "Comunidad de Madrid"),
        locationCreate(12, "Ponferrada", "Castilla y Leon"),
        locationCreate(13, "Getxo", "País Vasco"),
        locationCreate(14, "Alicante", "Comunidad Valenciana"),
        locationCreate(15, "Melide", "Galicia"),
        locationCreate(16, "San Sebastián", "País Vasco"),
    ]);
}

async function createRaces() {
    console.log("Adding Races");
    await Promise.all([
        raceCreate(0,
        "Maratón de Valencia",
        categories[0],
        "The Valencia Marathon is held annually in the historic city of Valencia which, with its entirely flat circuit and perfect November temperature, averaging between 12-17 degrees, represents the ideal setting for hosting such a long-distance sporting challenge.",
        "./public/images/logo-maraton-valencia.png"
        ),
        raceCreate(1,
        "Maratón de Sevilla",
        categories[0],
        "The Zurich Maratón de Sevilla is the flattest marathon in Europe and the second fastest in Spain. It is the perfect place to run a personal best and achieve your goals.",
        "./public/images/logo-maraton-sevilla.png"
        ),
        raceCreate(2,
        "Maratón de Castellón",
        categories[0],
        "This WA Bronze Label race is an unavoidable appointment in the regional, national and international sports calendar, which will gather more than 5000 runners from around the world and will undoubtedly consolidate Castelló as a reference sports city.",
        "./public/images/logo-maraton-castellon.png"
        ),
        raceCreate(3,
        "Os 21 Do Camiño",
        categories[0],
        "Os 21 do Camiño, the half marathon in A Coruña, a route through Galician nature that goes through El Camino de Santiago, awarded the World Heritage designation by the UNESCO. This route is completed by places of great spiritual importance, where you can beat your personal record or simply feel that your goal has been achieved with great success.",
        "./public/images/logo-os-21-do-camino.jpg"
        ),
        raceCreate(4,
        "Behobia",
        categories[0],
        "This is a race with a very demanding route, with two major summits, Gaintxurizketa (km. 7) and Alto de Miracruz (km. 16), as well as a number of climbs and descents which should be taken into account when gauging your effort. There is a positive climb of 192 m. Our aim through the following information is to use plans and a description of each kilometre to give an understanding of the route to help you mentally prepare for the race.",
        "./public/images/logo-behobia.jpeg"
        ),
        raceCreate(5,
        "Ultra Trail Sierra Nevada",
        categories[1],
        "An experience full of nature, culture and high summits. From the foot of the Alhambra to the Veleta Peak.",
        "./public/images/logo-ultra-trail-sierra-nevada.jpg"
        ),
        raceCreate(6,
        "Zegama Aizkorri",
        categories[1],
        "The Zegama-Aizkorri is an international skyrunning competition held for the first time in 2002. It runs every year in Spain from Zegama up to Aizkorri and finish in Zegama in May and consists of two races, a SkyMarathon and from 2015 also a Vertical Kilometer both valid for the Skyrunner World Series.",
        "./public/images/zegama-aizkorri-logo.jpg"
        ),
        raceCreate(7,
            "Gran Trail Picos de Europa",
            categories[1],
            "One of the most renowned races in northern Spain in the Western Massif of the Picos de Europa. It is organized by a team with extensive experience, with the support of the City Council of Onís. It is a spectacular route, for its beauty and its hardness. It starts in Benia de Onís and enters the Picos de Europa National Park, with 4 levels of difficulty.",
            "./public/images/logo-gran-trail-picos-de-europa.png"
        ),
        raceCreate(8,
            "Gran Trail del Aneto",
            categories[1],
            "The Great Aneto-Posets Trail runs through all types of terrain, from tracks and trails to chambers and block chaos that surround the two highest peaks of the Pyrenees: the Aneto (3 404 m) and the Posets (3 375 m) . It is a spectacular race, in conditions of semi-self-sufficiency, that unites these two mountain ranges, forming an infinite route.",
            "./public/images/logo-gran-trail-aneto.png",
        ),
        raceCreate(9,
            "Transvulcania",
            categories[1],
            "Transvulcania is a long distance race that is held annually on La Palma, one of the western Canary Islands. It is considered one of the hardest mountain-ultramarathons in the world and one of the most important in Spain.",
            "./public/images/transvulcania-logo.jpeg",
        ),
        raceCreate(10,
            "Templar Race Monzón",
            categories[2],
            "The TEMPLAR of Monzón is undoubtedly the best obstacle race in Aragon and, according to the ranking by the digital magazine RUNEDIA, in collaboration with MUNDO DEPORTIVO, we are the BEST OBSTACLE RACE IN SPAIN for the last three editions of the race. It features a tough circuit with obstacles, passing through the monumental Castle of Monzón, and finishing with a brutal leg killer.",
            "./public/images/logo-templar-race-monzon.jpeg",
        ),
        raceCreate(11,
            "Spartan Race Madrid",
            categories[2],
            "The Spartan Race Madrid is a race that tests participants on rugged trails that require a mix of strength, agility, and speed. It's a tough and exciting OCR race.",
            "./public/images/logo-spartan.jpeg",
        ),
        raceCreate(12,
            "Farinato Race Ponferrada",
            categories[2],
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
            "./public/images/logo-farinato.webp",
        ),
        raceCreate(13,
            "Desafío de Guerreros Getxo",
            categories[2],
            "Warrior Challenge is about experiencing the thrill of team sports and obstacle races like never before... Surrounded by nature, with water, mud, impressive obstacles, and lots of, lots of fun.",
            "./public/images/logo-desafio-guerreros.png",
        ),
        raceCreate(14,
            "Survivor Race Alicante",
            categories[2],
            "Survivor Race is a race with distances of 6km, 10km, and 15km full of obstacles that offer different levels of difficulty and fun.",
            "./public/images/logo-survivor-race-alicante.png",
        ),
    ]);
}

async function createModalities() {
    console.log("Adding modalities");
    await Promise.all([
        modalityCreate(0,
            races[0],
            locations[1],
            locations[1],
            42.195,
            0,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
        ),
        modalityCreate(1,
            races[1],
            locations[2],
            locations[2],
            42.195,
            0,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
        ),
        modalityCreate(2,
            races[2],
            locations[3],
            locations[3],
            42.195,
            0,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
        ),
        modalityCreate(3,
            races[3],
            locations[4],
            locations[4],
            21,
            0,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
        ),
        modalityCreate(4,
            races[4],
            locations[5],
            locations[5],
            20,
            0,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
        ),
        modalityCreate(5,
            races[5],
            locations[6],
            locations[6],
            105,
            0,
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies ultricies.",
        ),
    ]);
}

async function createInstances() {
    console.log("Adding instances");
    await Promise.all([
        instanceCreate(0, modalities[0], "2022-12-01", 60),
        instanceCreate(1, modalities[1], "2022-12-01", 60),
        instanceCreate(2, modalities[2], "2022-12-01", 60),
        instanceCreate(3, modalities[3], "2022-12-01", 30),
        instanceCreate(4, modalities[4], "2022-12-01", 30),
        instanceCreate(5, modalities[5], "2022-12-01", 30),
    ]);
}