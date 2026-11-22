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

export async function compareCars(request, response) {
  const rawIds =
    request.query.ids ||
    request.query.carIds ||
    request.params.ids ||
    "";
  const ids = String(rawIds)
    .split(",")
    .map((id) => Number(id.trim()))
    .filter((id) => Number.isInteger(id));

  if (ids.length !== 2 || ids[0] === ids[1])
    throw new HttpError(400, "Exactly two different car ids are required.");

  const store = await getStore();
  const cars = ids.map((id) => store.cars.find((car) => car.id === id));
  if (cars.some((car) => !car))
    throw new HttpError(404, "One or both cars were not found.");

  response.json({
    success: true,
    cars: cars.map((car) => publicCar(car, store)),
  });
}

export async function recommendCars(request, response) {
  const store = await getStore();
  const body = request.body || {};
  const text = [
    body.requirements,
    body.preferences,
    body.useCase,
    body.description,
    body.query,
  ]
    .filter((value) => typeof value === "string")
    .join(" ")
    .toLowerCase();

  const explicitFuel = optionalString(body.fuel, "fuel", 30);
  const explicitBody = optionalString(body.bodyType, "bodyType", 30);
  const explicitBrand = optionalString(body.brand, "brand", 80);
  const explicitSeats =
    body.seats === undefined ? undefined : integer(body.seats, "seats", 1, 20);

  let maxBudget = body.maxBudget ?? body.budget ?? body.maxPrice;
  if (maxBudget !== undefined && maxBudget !== null && maxBudget !== "") {
    maxBudget = Number(maxBudget);
    if (!Number.isFinite(maxBudget) || maxBudget < 0)
      throw new HttpError(400, "Budget must be a non-negative number.");
  } else {
    maxBudget = undefined;
  }

  const fuel =
    explicitFuel ||
    (/electric|\bev\b|ev\b/.test(text)
      ? "Electric"
      : /hybrid/.test(text)
        ? "Hybrid"
        : /diesel/.test(text)
          ? "Diesel"
          : /petrol|gasoline/.test(text)
            ? "Petrol"
            : undefined);

  let bodyType =
    explicitBody ||
    (/suv|crossover|off.?road/.test(text)
      ? "SUV"
      : /sedan/.test(text)
        ? "Sedan"
        : /hatchback/.test(text)
          ? "Hatchback"
          : /mpv|muv/.test(text)
            ? "MPV"
            : undefined);

  const brand =
    explicitBrand ||
    [...new Set(store.cars.map((car) => car.brand))]
      .find((candidate) => text.includes(candidate.toLowerCase()));

  let seats = explicitSeats;
  if (seats === undefined) {
    const seatMatch = text.match(/\b([1-9]|1\d|20)\s*(?:seat|seater)s?\b/);
    if (seatMatch) seats = Number(seatMatch[1]);
  }

  if (maxBudget === undefined) {
    const lakhMatch = text.match(
      /\b(?:under|below|budget(?: of)?|around|max(?:imum)?(?: of)?|upto|up to)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)\b/,
    );
    const croreMatch = text.match(
      /\b(?:under|below|budget(?: of)?|around|max(?:imum)?(?: of)?|upto|up to)?\s*(\d+(?:\.\d+)?)\s*(crore|cr)\b/,
    );
    if (croreMatch) maxBudget = Number(croreMatch[1]) * 100;
    else if (lakhMatch) maxBudget = Number(lakhMatch[1]);
  }

  const limitValue =
    body.limit === undefined ? 6 : integer(body.limit, "limit", 1, 20);
  const priority = typeof body.priority === "string"
    ? body.priority.toLowerCase()
    : "";

  const candidates = store.cars
    .filter(
      (car) =>
        maxBudget === undefined || car.price <= maxBudget,
    )
    .filter(
      (car) =>
        !fuel || car.fuel.toLowerCase() === fuel.trim().toLowerCase(),
    )
    .filter(
      (car) =>
        !bodyType ||
        car.bodyType.toLowerCase() === bodyType.trim().toLowerCase(),
    )
    .filter(
      (car) =>
        !seats || car.seats >= seats,
    )
    .filter(
      (car) =>
        !brand || car.brand.toLowerCase() === brand.trim().toLowerCase(),
    )
    .map((car) => {
      const publicCarData = publicCar(car, store);
      let score = 30;
      const reasons = [];

      if (maxBudget !== undefined) {
        const budgetFit = 1 - Math.max(0, car.price / maxBudget - 0.5);
        score += Math.max(0, budgetFit) * 20;
        reasons.push(`Within your ₹${maxBudget} lakh budget`);
      }
      if (fuel && car.fuel.toLowerCase() === fuel.trim().toLowerCase()) {
        score += 18;
        reasons.push(`${car.fuel} powertrain matches your preference`);
      }
      if (bodyType && car.bodyType.toLowerCase() === bodyType.trim().toLowerCase()) {
        score += 16;
        reasons.push(`${car.bodyType} matches your preferred body type`);
      }
      if (seats && car.seats >= seats) {
        score += 12;
        reasons.push(`${car.seats} seats suit your capacity needs`);
      }
      if (brand && car.brand.toLowerCase() === brand.trim().toLowerCase()) {
        score += 15;
        reasons.push(`From your preferred ${car.brand} brand`);
      }
      if (priority === "rating" || priority === "reviews") {
        score += publicCarData.rating * 5;
      } else if (priority === "budget" || priority === "value") {
        score += Math.max(0, 25 - car.price) * 0.3;
      } else {
        score += publicCarData.rating * 3;
        score += car.featured ? 5 : 0;
      }
      if (priority === "space" && car.seats >= 7) score += 10;

      if (text.includes("family") && car.seats >= 5) {
        score += 8;
        reasons.push("Practical choice for family use");
      }
      if (text.includes("city") || text.includes("commute")) {
        if (car.bodyType === "Hatchback" || car.bodyType === "Sedan")
          score += 8;
        reasons.push("Suitable for everyday driving");
      }
      if (text.includes("off road") || text.includes("offroad") || text.includes("adventure")) {
        if (car.bodyType === "SUV") {
          score += 10;
          reasons.push("SUV format suits adventure use");
        }
      }

      return {
        ...publicCarData,
        recommendationScore: Math.round(Math.min(100, score)),
        reasons: reasons.slice(0, 3),
      };
    })
    .sort((a, b) =>
      b.recommendationScore - a.recommendationScore ||
      b.rating - a.rating ||
      a.price - b.price,
    )
    .slice(0, limitValue);

  response.json({
    success: true,
    preferences: {
      budget: maxBudget,
      fuel,
      bodyType,
      seats,
      brand,
      priority,
    },
    count: candidates.length,
    items: candidates,
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
