const ADJECTIVES = [
  "Swift",
  "Silent",
  "Cosmic",
  "Bright",
  "Wild",
  "Golden",
  "Lucky",
  "Bold",
  "Quiet",
  "Wandering",
  "Rapid",
  "Hidden",
  "Electric",
  "Gentle",
  "Fierce",
  "Mellow",
  "Rusty",
  "Frosty",
  "Sunny",
  "Shadowy",
];

const NOUNS = [
  "Falcon",
  "Otter",
  "Comet",
  "Panther",
  "Willow",
  "Ember",
  "Fox",
  "Raven",
  "Tiger",
  "Nomad",
  "Wolf",
  "Phoenix",
  "Badger",
  "Lynx",
  "Sparrow",
  "Wanderer",
  "Pioneer",
  "Drifter",
  "Hawk",
  "Coyote",
];

export function generateRandomUsername() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  return `${adjective}${noun}${number}`;
}
