import { MongoClient } from "mongodb";
import { env } from "../config/env.js";

const seedCars = [
  [
    "Hyundai",
    "Creta",
    2024,
    14.5,
    "Diesel",
    5,
    "SUV",
    "Asset/Images/cars/1778438147_cretafront.jpg",
    true,
  ],
  [
    "Honda",
    "City",
    2024,
    12,
    "Petrol",
    5,
    "Sedan",
    "Asset/Images/cars/1778439154_image_main_honda-city-front.avif",
    true,
  ],
  [
    "Kia",
    "Seltos",
    2024,
    15.5,
    "Petrol",
    5,
    "SUV",
    "Asset/Images/cars/1778468064_image_main_Kia seltos-front-view.avif",
    false,
  ],
  [
    "Tata",
    "Nexon EV",
    2024,
    16.2,
    "Electric",
    5,
    "SUV",
    "Asset/Images/audi.jpg",
    false,
  ],
  [
    "Toyota",
    "Fortuner",
    2023,
    35,
    "Diesel",
    7,
    "SUV",
    "Asset/Images/mercedes.jpg",
    false,
  ],
];

function initialData() {
  return {
    counters: {
      users: 1,
      cars: seedCars.length,
      reviews: 0,
      posts: 0,
      discussions: 0,
      replies: 0,
      comments: 0,
    },
    users: [
      {
        id: 1,
        name: "Admin",
        email: "admin@autoinsight.local",
        passwordHash:
          "$2a$10$7EqJtq98hPqEX7fNZaFWoOeY2xB6aX3wXH8g9V2Y6k4Lk2sXWm5eS",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ],
    cars: seedCars.map((car, index) => ({
      id: index + 1,
      brand: car[0],
      model: car[1],
      year: car[2],
      price: car[3],
      fuel: car[4],
      seats: car[5],
      bodyType: car[6],
      image: car[7],
      featured: car[8],
      createdAt: new Date().toISOString(),
    })),
    reviews: [],
    posts: [],
    discussions: [],
    replies: [],
    comments: [],
  };
}

let data;
let mongoClient;
let mongoState;
let writeQueue = Promise.resolve();

async function getMongoState() {
  if (!mongoClient) {
    mongoClient = new MongoClient(env.mongodbUri, {
      // Assumes a traditional Express server with modest local/early production traffic.
      maxPoolSize: 20,
      minPoolSize: 0,
      maxIdleTimeMS: 300000,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    await mongoClient.connect();
    mongoState = mongoClient
      .db(env.mongodbDatabase)
      .collection("application_state");
  }
  const stored = await mongoState.findOne({ _id: "autoinsight" });
  if (stored) {
    const { _id, ...state } = stored;
    return state;
  }
  const seeded = initialData();
  await mongoState.insertOne({ _id: "autoinsight", ...seeded });
  return seeded;
}

export async function getStore() {
  if (!env.mongodbUri) {
    throw new Error(
      "MONGODB_URI is required. Configure backend/.env before starting AutoInsight.",
    );
  }
  data = await getMongoState();
  return data;
}

export function saveStore() {
  writeQueue = writeQueue.then(async () => {
    if (!mongoState) await getMongoState();
    await mongoState.replaceOne(
      { _id: "autoinsight" },
      { _id: "autoinsight", ...data },
      { upsert: true },
    );
  });
  return writeQueue;
}

export async function closeStore() {
  if (mongoClient) await mongoClient.close();
  mongoClient = undefined;
  mongoState = undefined;
  data = undefined;
}

export function nextId(collection) {
  data.counters[collection] += 1;
  return data.counters[collection];
}

export function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function publicCar(car, store) {
  const reviews = store.reviews.filter((review) => review.carId === car.id);
  return {
    ...car,
    rating: reviews.length
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1),
        )
      : 0,
    reviewCount: reviews.length,
  };
}
