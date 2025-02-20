import { fetchWithAuth } from "@/lib/utils";

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: number;
  zip_code: string;
  img: string;
};

type FetchDogsParams = {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  page?: number;
  from?: number;
  size?: number;
  sort?: string;
};

type DogSearchResults = {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
};

type FetchDogsResults = {
  dogs: Dog[];
  total: number;
  next?: string;
  prev?: string;
};

export interface Match {
  match: string;
}

export async function fetchDogDetails(dogIds: string[]): Promise<Dog[]> {
  if (!Array.isArray(dogIds) || dogIds.length === 0) {
    throw new Error("dogIds must be a non-empty array");
  }

  const response = await fetchWithAuth(
    "https://frontend-take-home-service.fetch.com/dogs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dog details");
  }

  const dogs: Dog[] = await response.json();
  return dogs;
}

export async function fetchDogs(
  params: FetchDogsParams = {}
): Promise<FetchDogsResults> {
  const {
    breeds,
    zipCodes,
    ageMin,
    ageMax,
    page = 1,
    size = 10,
    from = 0,
    sort,
  } = params;

  const queryParams = new URLSearchParams();

  if (breeds && breeds.length > 0) {
    breeds.forEach((breed) => queryParams.append("breeds", breed));
  }

  if (sort) {
    queryParams.append("sort", sort);
  }

  if (zipCodes && zipCodes.length > 0) {
    zipCodes.forEach((zip) => queryParams.append("zipCodes", zip));
  }

  if (ageMin !== undefined) {
    queryParams.append("ageMin", ageMin.toString());
  }

  if (ageMax !== undefined) {
    queryParams.append("ageMax", ageMax.toString());
  }

  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());
  queryParams.append("from", from.toString());

  const searchResponse = await fetchWithAuth(
    `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`
  );

  if (!searchResponse.ok) {
    throw new Error("Failed to fetch dog IDs");
  }

  const searchData: DogSearchResults = await searchResponse.json();

  const { resultIds, total, next, prev } = searchData;

  if (!resultIds || resultIds.length === 0) {
    return { dogs: [], total, next, prev };
  }

  const dogs = await fetchDogDetails(resultIds);

  return { dogs, total, next, prev };
}

export async function fetchDogMatch(dogIds: string[]): Promise<Match> {
  if (!Array.isArray(dogIds) || dogIds.length === 0) {
    throw new Error("dogIds must be a non-empty array");
  }

  const response = await fetchWithAuth(
    "https://frontend-take-home-service.fetch.com/dogs/match",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dogIds),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch dog match");
  }

  const matchData: Match = await response.json();
  return matchData;
}
