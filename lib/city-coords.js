/* Position approximative de quelques villes, pour la carte du dashboard.

   Les coordonnées viennent normalement des en-têtes Vercel (x-vercel-ip-latitude /
   -longitude) et sont enregistrées avec la visite. Cette table ne sert que de
   repli pour les visites déjà enregistrées AVANT l'ajout des coordonnées : on
   retrouve alors la ville par son nom. Une ville absente de la liste n'apparaît
   simplement pas sur la carte (elle reste dans la carte « Villes »). */

const CITIES = [
  // Côte d'Ivoire
  ['Abidjan', 'CI', 5.36, -4.01], ['Yamoussoukro', 'CI', 6.82, -5.28], ['Bouaké', 'CI', 7.69, -5.03],
  ['San-Pédro', 'CI', 4.75, -6.64], ['Korhogo', 'CI', 9.46, -5.63], ['Daloa', 'CI', 6.88, -6.45],
  ['Man', 'CI', 7.41, -7.55], ['Gagnoa', 'CI', 6.13, -5.95], ['Divo', 'CI', 5.84, -5.36],
  ['Abengourou', 'CI', 6.73, -3.49], ['Grand-Bassam', 'CI', 5.21, -3.74], ['Bingerville', 'CI', 5.36, -3.89],
  ['Anyama', 'CI', 5.49, -4.05], ['Yopougon', 'CI', 5.34, -4.09], ['Odienné', 'CI', 9.51, -7.56],
  ['Ferkessédougou', 'CI', 9.59, -5.20], ['Bondoukou', 'CI', 8.04, -2.80], ['Séguéla', 'CI', 7.96, -6.67],
  ['Soubré', 'CI', 5.79, -6.59], ['Sassandra', 'CI', 4.95, -6.09], ['Aboisso', 'CI', 5.47, -3.21],
  ['Dimbokro', 'CI', 6.65, -4.71], ['Adzopé', 'CI', 6.11, -3.86], ['Agboville', 'CI', 5.93, -4.21],
  ['Dabou', 'CI', 5.33, -4.38],
  // Afrique
  ['Dakar', 'SN', 14.69, -17.45], ['Douala', 'CM', 4.05, 9.77], ['Yaoundé', 'CM', 3.85, 11.50],
  ['Cotonou', 'BJ', 6.37, 2.43], ['Ouagadougou', 'BF', 12.37, -1.52], ['Bamako', 'ML', 12.64, -8.00],
  ['Lomé', 'TG', 6.13, 1.22], ['Accra', 'GH', 5.60, -0.19], ['Lagos', 'NG', 6.52, 3.38],
  ['Libreville', 'GA', 0.39, 9.45], ['Conakry', 'GN', 9.64, -13.58], ['Niamey', 'NE', 13.51, 2.11],
  ['Brazzaville', 'CG', -4.27, 15.28], ['Kinshasa', 'CD', -4.44, 15.27], ['Casablanca', 'MA', 33.57, -7.59],
  ['Tunis', 'TN', 36.81, 10.18],
  // Europe et Amérique du Nord
  ['Paris', 'FR', 48.86, 2.35], ['Lyon', 'FR', 45.76, 4.84], ['Marseille', 'FR', 43.30, 5.37],
  ['Bruxelles', 'BE', 50.85, 4.35], ['Brussels', 'BE', 50.85, 4.35], ['London', 'GB', 51.51, -0.13],
  ['Frankfurt am Main', 'DE', 50.11, 8.68], ['Montréal', 'CA', 45.50, -73.57], ['Montreal', 'CA', 45.50, -73.57],
  ['New York', 'US', 40.71, -74.01], ['Ashburn', 'US', 39.04, -77.49],
]

const normalize = (value) =>
  String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const INDEX = new Map()
for (const [name, country, lat, lng] of CITIES) {
  const key = normalize(name)
  const list = INDEX.get(key) || []
  list.push({ country, lat, lng })
  INDEX.set(key, list)
}

// { lat, lng } ou null. Si le pays est connu il doit correspondre (deux villes de même nom).
export function lookupCityCoords(city, country = null) {
  const matches = INDEX.get(normalize(city))
  if (!matches) return null
  const hit = country ? matches.find((m) => m.country === String(country).toUpperCase()) : matches[0]
  return hit ? { lat: hit.lat, lng: hit.lng } : null
}
