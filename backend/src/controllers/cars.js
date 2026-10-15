import { getStore, nextId, publicCar, saveStore } from "../services/store.js";
import { HttpError, paginate, parsePagination } from "../utils/http.js";
import {
  integer,
  optionalString,
  requiredString,
} from "../utils/validation.js";

export async function listCars(request, response) {
  const store = await getStore();
  let cars = store.cars
    .filter(
      (car) =>
        !request.query.brand ||
        car.brand.toLowerCase() === request.query.brand.toLowerCase(),
    )
    .filter(
      (car) =>
        !request.query.fuel ||
        car.fuel.toLowerCase() === request.query.fuel.toLowerCase(),
    )
    .filter(
      (car) =>
        !request.query.featured ||
        String(car.featured) === request.query.featured,
    );
  if (request.query.search)
    cars = cars.filter((car) =>
      `${car.brand} ${car.model}`
        .toLowerCase()
        .includes(request.query.search.toLowerCase()),
    );
  const { page, limit } = parsePagination(request.query);
  const result = paginate(
    cars.map((car) => publicCar(car, store)),
    page,
    limit,
  );
  response.json({ success: true, ...result });
}

export async function getCar(request, response) {
  const store = await getStore();
  const car = store.cars.find(
    (candidate) => candidate.id === Number(request.params.id),
  );
  if (!car) throw new HttpError(404, "Car not found.");
  response.json({
    success: true,
    car: publicCar(car, store),
    reviews: store.reviews.filter((review) => review.carId === car.id),
  });
}

export async function createCar(request, response) {
  const store = await getStore();
  const car = {
    id: nextId("cars"),
    brand: requiredString(request.body.brand, "brand", 80),
    model: requiredString(request.body.model, "model", 100),
    year: integer(request.body.year, "year", 1900, 2100),
    price: Number(request.body.price),
    fuel: requiredString(request.body.fuel, "fuel", 30),
    seats: integer(request.body.seats ?? 5, "seats", 1, 20),
    bodyType: requiredString(request.body.bodyType, "bodyType", 30),
    image: optionalString(request.body.image, "image", 500) || "",
    featured: Boolean(request.body.featured),
    createdAt: new Date().toISOString(),
  };
  if (!Number.isFinite(car.price) || car.price < 0)
    throw new HttpError(400, "price must be a non-negative number.");
  store.cars.push(car);
  await saveStore();
  response.status(201).json({ success: true, car: publicCar(car, store) });
}

export async function deleteCar(request, response) {
  const store = await getStore();
  const index = store.cars.findIndex(
    (car) => car.id === Number(request.params.id),
  );
  if (index < 0) throw new HttpError(404, "Car not found.");
  store.cars.splice(index, 1);
  store.reviews = store.reviews.filter(
    (review) => review.carId !== Number(request.params.id),
  );
  await saveStore();
  response.status(204).end();
}

export async function updateCar(request, response) {
  const store = await getStore();
  const car = store.cars.find(
    (candidate) => candidate.id === Number(request.params.id),
  );
  if (!car) throw new HttpError(404, "Car not found.");
  const fields = ["brand", "model", "fuel", "bodyType", "image"];
  for (const field of fields) {
    if (request.body[field] !== undefined)
      car[field] = requiredString(
        request.body[field],
        field,
        field === "image" ? 500 : 100,
      );
  }
  if (request.body.year !== undefined)
    car.year = integer(request.body.year, "year", 1900, 2100);
  if (request.body.seats !== undefined)
    car.seats = integer(request.body.seats, "seats", 1, 20);
  if (request.body.price !== undefined) {
    car.price = Number(request.body.price);
    if (!Number.isFinite(car.price) || car.price < 0)
      throw new HttpError(400, "price must be a non-negative number.");
  }
  if (request.body.featured !== undefined)
    car.featured = Boolean(request.body.featured);
  await saveStore();
  response.json({ success: true, car: publicCar(car, store) });
}
