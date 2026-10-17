export class Travel {
  id: number;
  travelerName: string;
  visitedCountries: string[];

  constructor(
    id: number,
    travelerName: string,
    visitedCountries: string[] = [],
  ) {
    this.id = id;
    this.travelerName = travelerName;
    this.visitedCountries = [...visitedCountries];
  }

  get visitedCount(): number {
    return this.visitedCountries.length;
  }

  addCountry(country: string): void {
    if (!this.visitedCountries.includes(country)) {
      this.visitedCountries.push(country);
    }
  }

  removeCountry(country: string): void {
    const index = this.visitedCountries.indexOf(country);
    if (index !== -1) {
      this.visitedCountries.splice(index, 1);
    }
  }
}

// 1. { "exportName": "groupTravelsByCountryCount" }
export function groupTravelsByCountryCount(
  travels: Travel[],
): Map<number, Travel[]> {
  const map = new Map<number, Travel[]>();
  travels.forEach((travel) => {
    const count = travel.visitedCount;
    if (!map.has(count)) {
      map.set(count, []);
    }
    map.get(count)!.push(travel);
  });
  return map;
}

// 2. { "exportName": "getUniqueCountries" }
export function getUniqueCountries(travels: Travel[]): string[] {
  const uniqueCountries = new Set<string>();
  travels.forEach((travel) => {
    travel.visitedCountries.forEach((country) => uniqueCountries.add(country));
  });
  return Array.from(uniqueCountries);
}

// 3. { "exportName": "findTravelsByCountry" }
export function findTravelsByCountry(
  travels: Travel[],
  country: string,
): Travel[] {
  return travels.filter((travel) => travel.visitedCountries.includes(country));
}

// 4. { "exportName": "groupTravelersByCountry" }
export function groupTravelersByCountry(
  travels: Travel[],
): Record<string, Travel[]> {
  const result: Record<string, Travel[]> = {};
  travels.forEach((travel) => {
    travel.visitedCountries.forEach((country) => {
      if (!result[country]) {
        result[country] = [];
      }
      result[country].push(travel);
    });
  });
  return result;
}

// 5. { "exportName": "findTravelsAboveCountryCount" }
export function findTravelsAboveCountryCount(
  travels: Travel[],
  count: number,
): Travel[] {
  return travels.filter((travel) => travel.visitedCount > count);
}
