// Curated AED local SEO directory.
// Top countries with major-city coverage, plus lat/lng + slug + a small radius for
// the OpenAEDMap bbox filter on each city's hub page.

export type AedCity = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  radiusKm: number;
};

export type AedCountry = {
  code: string; // ISO 3166-1 alpha-2
  slug: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  zoom: number;
  cities: AedCity[];
};

export const AED_COUNTRIES: AedCountry[] = [
  {
    code: "AU", slug: "australia", name: "Australia", flag: "🇦🇺",
    lat: -25.2744, lng: 133.7751, zoom: 4,
    cities: [
      { slug: "sydney",    name: "Sydney",    lat: -33.8688, lng: 151.2093, radiusKm: 30 },
      { slug: "melbourne", name: "Melbourne", lat: -37.8136, lng: 144.9631, radiusKm: 35 },
      { slug: "brisbane",  name: "Brisbane",  lat: -27.4698, lng: 153.0251, radiusKm: 30 },
      { slug: "perth",     name: "Perth",     lat: -31.9523, lng: 115.8613, radiusKm: 30 },
      { slug: "adelaide",  name: "Adelaide",  lat: -34.9285, lng: 138.6007, radiusKm: 25 },
      { slug: "canberra",  name: "Canberra",  lat: -35.2809, lng: 149.1300, radiusKm: 20 },
      { slug: "hobart",    name: "Hobart",    lat: -42.8821, lng: 147.3272, radiusKm: 20 },
      { slug: "darwin",    name: "Darwin",    lat: -12.4634, lng: 130.8456, radiusKm: 20 },
      { slug: "gold-coast",name: "Gold Coast",lat: -28.0167, lng: 153.4000, radiusKm: 25 },
      { slug: "newcastle", name: "Newcastle", lat: -32.9283, lng: 151.7817, radiusKm: 20 },
    ],
  },
  {
    code: "NZ", slug: "new-zealand", name: "New Zealand", flag: "🇳🇿",
    lat: -41.0, lng: 174.0, zoom: 5,
    cities: [
      { slug: "auckland",    name: "Auckland",    lat: -36.8485, lng: 174.7633, radiusKm: 30 },
      { slug: "wellington",  name: "Wellington",  lat: -41.2865, lng: 174.7762, radiusKm: 20 },
      { slug: "christchurch",name: "Christchurch",lat: -43.5321, lng: 172.6362, radiusKm: 25 },
      { slug: "hamilton",    name: "Hamilton",    lat: -37.7870, lng: 175.2793, radiusKm: 20 },
      { slug: "dunedin",     name: "Dunedin",     lat: -45.8788, lng: 170.5028, radiusKm: 20 },
    ],
  },
  {
    code: "GB", slug: "united-kingdom", name: "United Kingdom", flag: "🇬🇧",
    lat: 54.5, lng: -2.5, zoom: 5,
    cities: [
      { slug: "london",     name: "London",     lat: 51.5074, lng: -0.1278, radiusKm: 25 },
      { slug: "manchester", name: "Manchester", lat: 53.4808, lng: -2.2426, radiusKm: 20 },
      { slug: "birmingham", name: "Birmingham", lat: 52.4862, lng: -1.8904, radiusKm: 20 },
      { slug: "edinburgh",  name: "Edinburgh",  lat: 55.9533, lng: -3.1883, radiusKm: 20 },
      { slug: "glasgow",    name: "Glasgow",    lat: 55.8642, lng: -4.2518, radiusKm: 20 },
      { slug: "liverpool",  name: "Liverpool",  lat: 53.4084, lng: -2.9916, radiusKm: 20 },
      { slug: "leeds",      name: "Leeds",      lat: 53.8008, lng: -1.5491, radiusKm: 20 },
      { slug: "bristol",    name: "Bristol",    lat: 51.4545, lng: -2.5879, radiusKm: 20 },
      { slug: "cardiff",    name: "Cardiff",    lat: 51.4816, lng: -3.1791, radiusKm: 20 },
      { slug: "belfast",    name: "Belfast",    lat: 54.5973, lng: -5.9301, radiusKm: 20 },
    ],
  },
  {
    code: "IE", slug: "ireland", name: "Ireland", flag: "🇮🇪",
    lat: 53.4, lng: -8.2, zoom: 6,
    cities: [
      { slug: "dublin",    name: "Dublin",    lat: 53.3498, lng: -6.2603, radiusKm: 20 },
      { slug: "cork",      name: "Cork",      lat: 51.8985, lng: -8.4756, radiusKm: 20 },
      { slug: "galway",    name: "Galway",    lat: 53.2707, lng: -9.0568, radiusKm: 20 },
      { slug: "limerick",  name: "Limerick",  lat: 52.6638, lng: -8.6267, radiusKm: 20 },
    ],
  },
  {
    code: "US", slug: "united-states", name: "United States", flag: "🇺🇸",
    lat: 39.5, lng: -98.35, zoom: 4,
    cities: [
      { slug: "new-york",      name: "New York",      lat: 40.7128, lng: -74.0060, radiusKm: 25 },
      { slug: "los-angeles",   name: "Los Angeles",   lat: 34.0522, lng: -118.2437, radiusKm: 30 },
      { slug: "chicago",       name: "Chicago",       lat: 41.8781, lng: -87.6298, radiusKm: 25 },
      { slug: "houston",       name: "Houston",       lat: 29.7604, lng: -95.3698, radiusKm: 30 },
      { slug: "phoenix",       name: "Phoenix",       lat: 33.4484, lng: -112.0740, radiusKm: 30 },
      { slug: "philadelphia",  name: "Philadelphia",  lat: 39.9526, lng: -75.1652, radiusKm: 20 },
      { slug: "san-francisco", name: "San Francisco", lat: 37.7749, lng: -122.4194, radiusKm: 20 },
      { slug: "seattle",       name: "Seattle",       lat: 47.6062, lng: -122.3321, radiusKm: 20 },
      { slug: "boston",        name: "Boston",        lat: 42.3601, lng: -71.0589, radiusKm: 20 },
      { slug: "washington-dc", name: "Washington DC", lat: 38.9072, lng: -77.0369, radiusKm: 20 },
    ],
  },
  {
    code: "CA", slug: "canada", name: "Canada", flag: "🇨🇦",
    lat: 56.1, lng: -106.3, zoom: 4,
    cities: [
      { slug: "toronto",   name: "Toronto",   lat: 43.6532, lng: -79.3832, radiusKm: 25 },
      { slug: "montreal",  name: "Montréal",  lat: 45.5017, lng: -73.5673, radiusKm: 25 },
      { slug: "vancouver", name: "Vancouver", lat: 49.2827, lng: -123.1207, radiusKm: 25 },
      { slug: "calgary",   name: "Calgary",   lat: 51.0447, lng: -114.0719, radiusKm: 25 },
      { slug: "ottawa",    name: "Ottawa",    lat: 45.4215, lng: -75.6972, radiusKm: 20 },
      { slug: "edmonton",  name: "Edmonton",  lat: 53.5461, lng: -113.4938, radiusKm: 25 },
    ],
  },
  {
    code: "DE", slug: "germany", name: "Germany", flag: "🇩🇪",
    lat: 51.1657, lng: 10.4515, zoom: 6,
    cities: [
      { slug: "berlin",    name: "Berlin",    lat: 52.5200, lng: 13.4050, radiusKm: 20 },
      { slug: "hamburg",   name: "Hamburg",   lat: 53.5511, lng: 9.9937,  radiusKm: 20 },
      { slug: "munich",    name: "Munich",    lat: 48.1351, lng: 11.5820, radiusKm: 20 },
      { slug: "cologne",   name: "Cologne",   lat: 50.9375, lng: 6.9603,  radiusKm: 20 },
      { slug: "frankfurt", name: "Frankfurt", lat: 50.1109, lng: 8.6821,  radiusKm: 20 },
      { slug: "stuttgart", name: "Stuttgart", lat: 48.7758, lng: 9.1829,  radiusKm: 20 },
    ],
  },
  {
    code: "FR", slug: "france", name: "France", flag: "🇫🇷",
    lat: 46.6, lng: 2.2, zoom: 6,
    cities: [
      { slug: "paris",    name: "Paris",    lat: 48.8566, lng: 2.3522, radiusKm: 20 },
      { slug: "marseille",name: "Marseille",lat: 43.2965, lng: 5.3698, radiusKm: 20 },
      { slug: "lyon",     name: "Lyon",     lat: 45.7640, lng: 4.8357, radiusKm: 20 },
      { slug: "toulouse", name: "Toulouse", lat: 43.6047, lng: 1.4442, radiusKm: 20 },
      { slug: "nice",     name: "Nice",     lat: 43.7102, lng: 7.2620, radiusKm: 20 },
      { slug: "bordeaux", name: "Bordeaux", lat: 44.8378, lng:-0.5792, radiusKm: 20 },
    ],
  },
  {
    code: "NL", slug: "netherlands", name: "Netherlands", flag: "🇳🇱",
    lat: 52.1326, lng: 5.2913, zoom: 7,
    cities: [
      { slug: "amsterdam", name: "Amsterdam", lat: 52.3676, lng: 4.9041, radiusKm: 20 },
      { slug: "rotterdam", name: "Rotterdam", lat: 51.9244, lng: 4.4777, radiusKm: 20 },
      { slug: "the-hague", name: "The Hague", lat: 52.0705, lng: 4.3007, radiusKm: 15 },
      { slug: "utrecht",   name: "Utrecht",   lat: 52.0907, lng: 5.1214, radiusKm: 15 },
    ],
  },
  {
    code: "BE", slug: "belgium", name: "Belgium", flag: "🇧🇪",
    lat: 50.5, lng: 4.47, zoom: 7,
    cities: [
      { slug: "brussels", name: "Brussels", lat: 50.8503, lng: 4.3517, radiusKm: 15 },
      { slug: "antwerp",  name: "Antwerp",  lat: 51.2194, lng: 4.4025, radiusKm: 15 },
      { slug: "ghent",    name: "Ghent",    lat: 51.0543, lng: 3.7174, radiusKm: 15 },
    ],
  },
  {
    code: "IT", slug: "italy", name: "Italy", flag: "🇮🇹",
    lat: 41.87, lng: 12.56, zoom: 6,
    cities: [
      { slug: "rome",    name: "Rome",    lat: 41.9028, lng: 12.4964, radiusKm: 20 },
      { slug: "milan",   name: "Milan",   lat: 45.4642, lng: 9.1900,  radiusKm: 20 },
      { slug: "naples",  name: "Naples",  lat: 40.8518, lng: 14.2681, radiusKm: 20 },
      { slug: "turin",   name: "Turin",   lat: 45.0703, lng: 7.6869,  radiusKm: 20 },
      { slug: "florence",name: "Florence",lat: 43.7696, lng: 11.2558, radiusKm: 15 },
    ],
  },
  {
    code: "ES", slug: "spain", name: "Spain", flag: "🇪🇸",
    lat: 40.46, lng: -3.74, zoom: 6,
    cities: [
      { slug: "madrid",    name: "Madrid",    lat: 40.4168, lng: -3.7038, radiusKm: 20 },
      { slug: "barcelona", name: "Barcelona", lat: 41.3851, lng:  2.1734, radiusKm: 20 },
      { slug: "valencia",  name: "Valencia",  lat: 39.4699, lng: -0.3763, radiusKm: 20 },
      { slug: "seville",   name: "Seville",   lat: 37.3891, lng: -5.9845, radiusKm: 20 },
    ],
  },
  {
    code: "PT", slug: "portugal", name: "Portugal", flag: "🇵🇹",
    lat: 39.4, lng: -8.2, zoom: 6,
    cities: [
      { slug: "lisbon", name: "Lisbon", lat: 38.7223, lng: -9.1393, radiusKm: 20 },
      { slug: "porto",  name: "Porto",  lat: 41.1579, lng: -8.6291, radiusKm: 20 },
    ],
  },
  {
    code: "PL", slug: "poland", name: "Poland", flag: "🇵🇱",
    lat: 51.9, lng: 19.1, zoom: 6,
    cities: [
      { slug: "warsaw",  name: "Warsaw",  lat: 52.2297, lng: 21.0122, radiusKm: 20 },
      { slug: "krakow",  name: "Kraków",  lat: 50.0647, lng: 19.9450, radiusKm: 20 },
      { slug: "gdansk",  name: "Gdańsk",  lat: 54.3520, lng: 18.6466, radiusKm: 20 },
      { slug: "wroclaw", name: "Wrocław", lat: 51.1079, lng: 17.0385, radiusKm: 20 },
    ],
  },
  {
    code: "SE", slug: "sweden", name: "Sweden", flag: "🇸🇪",
    lat: 60.1, lng: 18.6, zoom: 5,
    cities: [
      { slug: "stockholm", name: "Stockholm", lat: 59.3293, lng: 18.0686, radiusKm: 20 },
      { slug: "gothenburg",name: "Gothenburg",lat: 57.7089, lng: 11.9746, radiusKm: 20 },
      { slug: "malmo",     name: "Malmö",     lat: 55.6050, lng: 13.0038, radiusKm: 15 },
    ],
  },
  {
    code: "NO", slug: "norway", name: "Norway", flag: "🇳🇴",
    lat: 60.5, lng: 8.5, zoom: 5,
    cities: [
      { slug: "oslo",      name: "Oslo",      lat: 59.9139, lng: 10.7522, radiusKm: 20 },
      { slug: "bergen",    name: "Bergen",    lat: 60.3913, lng:  5.3221, radiusKm: 15 },
      { slug: "trondheim", name: "Trondheim", lat: 63.4305, lng: 10.3951, radiusKm: 15 },
    ],
  },
  {
    code: "DK", slug: "denmark", name: "Denmark", flag: "🇩🇰",
    lat: 56.26, lng: 9.5, zoom: 6,
    cities: [
      { slug: "copenhagen", name: "Copenhagen", lat: 55.6761, lng: 12.5683, radiusKm: 20 },
      { slug: "aarhus",     name: "Aarhus",     lat: 56.1629, lng: 10.2039, radiusKm: 15 },
    ],
  },
  {
    code: "JP", slug: "japan", name: "Japan", flag: "🇯🇵",
    lat: 36.2, lng: 138.25, zoom: 5,
    cities: [
      { slug: "tokyo",    name: "Tokyo",    lat: 35.6762, lng: 139.6503, radiusKm: 25 },
      { slug: "osaka",    name: "Osaka",    lat: 34.6937, lng: 135.5023, radiusKm: 20 },
      { slug: "kyoto",    name: "Kyoto",    lat: 35.0116, lng: 135.7681, radiusKm: 15 },
      { slug: "yokohama", name: "Yokohama", lat: 35.4437, lng: 139.6380, radiusKm: 15 },
    ],
  },
];

export function getAedCountryBySlug(slug: string): AedCountry | undefined {
  return AED_COUNTRIES.find((c) => c.slug === slug.toLowerCase());
}

export function getAedCityBySlug(country: AedCountry, slug: string): AedCity | undefined {
  return country.cities.find((c) => c.slug === slug.toLowerCase());
}
