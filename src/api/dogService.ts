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
};

type FetchDogsResults = {
  resultIds: string[];
  total: number;
  next?: string;
};

export async function fetchDogs(params: FetchDogsParams = {}): Promise<Dog[]> {
  const { breeds, zipCodes, ageMin, ageMax } = params;

  const queryParams = new URLSearchParams();

  if (breeds && breeds.length > 0) {
    breeds.forEach((breed) => queryParams.append("breeds", breed));
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

  const searchResponse = await fetchWithAuth(
    `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`
  );

  if (!searchResponse.ok) {
    throw new Error("Failed to fetch dog IDs");
  }

  const searchData: FetchDogsResults = await searchResponse.json();

  const { resultIds } = searchData;

  if (!resultIds || resultIds.length === 0) {
    return [];
  }

  const dogDetailsResponse = await fetchWithAuth(
    "https://frontend-take-home-service.fetch.com/dogs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultIds),
    }
  );

  if (!dogDetailsResponse.ok) {
    throw new Error("Failed to fetch dog details");
  }

  const dogs: Dog[] = await dogDetailsResponse.json();
  return dogs;
}
