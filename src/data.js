export const cars = [
  { id: 1, brand: 'Hyundai', model: 'Creta', year: 2024, price: 11, fuel: 'Petrol', body: 'SUV', seats: 5, mileage: '17.4 kmpl', rating: 4.6, reviews: 128, image: '/Asset/Images/cars/1778438147_cretafront.jpg', featured: true },
  { id: 2, brand: 'Honda', model: 'City', year: 2024, price: 11.8, fuel: 'Petrol', body: 'Sedan', seats: 5, mileage: '17.8 kmpl', rating: 4.5, reviews: 96, image: '/Asset/Images/cars/1778439154_image_main_honda-city-front.avif', featured: true },
  { id: 3, brand: 'Kia', model: 'Seltos', year: 2024, price: 10.9, fuel: 'Diesel', body: 'SUV', seats: 5, mileage: '19.1 kmpl', rating: 4.4, reviews: 84, image: '/Asset/Images/cars/1778468064_image_main_Kia seltos-front-view.avif' },
  { id: 4, brand: 'Tata', model: 'Sierra', year: 2025, price: 15, fuel: 'Electric', body: 'SUV', seats: 5, mileage: '450 km range', rating: 4.8, reviews: 42, image: '/Asset/Images/cars/1778468647_image_main_Tata-sierra-front.avif', featured: true },
  { id: 5, brand: 'BMW', model: '3 Series', year: 2024, price: 43.5, fuel: 'Petrol', body: 'Sedan', seats: 5, mileage: '16.1 kmpl', rating: 4.7, reviews: 51, image: '/Asset/Images/bmw.jpg' },
  { id: 6, brand: 'Mercedes-Benz', model: 'G-Wagon', year: 2024, price: 275, fuel: 'Petrol', body: 'SUV', seats: 5, mileage: '8.0 kmpl', rating: 4.9, reviews: 32, image: '/Asset/Images/gwagon.jpg' },
];

export const reviews = [
  { id: 1, name: 'Rahul Sharma', car: 'Hyundai Creta', rating: 5, title: 'A fantastic family SUV', body: 'The Creta has been comfortable, practical, and dependable for every family trip. The cabin is spacious and the mileage is great for daily driving.' },
  { id: 2, name: 'Priya Mehta', car: 'Honda City', rating: 4, title: 'Smooth and refined sedan', body: 'The City is a refined sedan with excellent ride quality and a very comfortable interior. It is an easy recommendation for city and highway use.' },
];

export const discussions = [
  { id: 1, author: 'CarBuyer2024', category: 'Buying Advice', title: 'First car under 10 lakhs - Need suggestions', body: 'I am planning to buy my first car with a budget of 10 lakhs. I need a reliable car with good mileage for daily commute.', replies: 34, views: 567 },
  { id: 2, author: 'EVExplorer', category: 'Electric Vehicles', title: 'Are electric cars practical for long trips?', body: 'Looking for owner experiences with charging infrastructure and highway range before making the switch to an EV.', replies: 18, views: 322 },
];

export const posts = [
  { id: 1, author: 'CarGuru123', type: 'tip', votes: 544, title: 'How to improve fuel efficiency by 20%', description: 'Maintain proper tire pressure, avoid aggressive acceleration, remove unnecessary weight from your car, and service your vehicle regularly.', tags: ['Fuel Efficiency', 'Tips', 'Savings'] },
  { id: 2, author: 'MechanicPro', type: 'tip', votes: 321, title: "DIY: How to change your car's air filter", description: "Changing your air filter is one of the easiest maintenance tasks you can do yourself. Most cars don't even require tools.", tags: ['DIY', 'Maintenance', 'Easy'] },
];
