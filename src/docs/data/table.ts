import { getRandomItemFromArray } from "../../utils/utils";
import { MOCK } from "./mock";

export const generateDummyTableData = (count: number) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      name: getRandomItemFromArray(MOCK.NAMES),
      surname: getRandomItemFromArray(MOCK.SURNAMES),
      age: Math.floor(Math.random() * 100),
      address: {
        country: getRandomItemFromArray(MOCK.COUNTRIES),
        city: getRandomItemFromArray(MOCK.CITIES),
        flag: getRandomItemFromArray(MOCK.FLAGS),
      },
    });
  }
  return data;
};
