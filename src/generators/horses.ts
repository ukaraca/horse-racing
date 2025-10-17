import {
  adjectives,
  animals,
  colors,
  type Config,
  uniqueNamesGenerator,
} from "unique-names-generator";

import { CONDITION_MAX, CONDITION_MIN, HORSE_COUNT_TOTAL, SURFACES } from "@/shared/constants";
import type { IHorse } from "@/shared/types";
import { generateUniqueColors } from "@/shared/utils/colors";

const rand = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateHorseName = (): string => {
  const secondWord = Math.random() > 0.5 ? colors : animals;

  const config: Config = {
    dictionaries: [adjectives, secondWord],
    separator: " ",
    style: "capital",
  };

  return uniqueNamesGenerator(config);
};

const generateHorses = (count = HORSE_COUNT_TOTAL): IHorse[] => {
  const n = Math.min(count, HORSE_COUNT_TOTAL);
  const colorList = generateUniqueColors(n);
  const horses: IHorse[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < n; i++) {
    let name = generateHorseName();
    while (usedNames.has(name)) {
      name = generateHorseName();
    }
    usedNames.add(name);

    const base = rand(CONDITION_MIN, CONDITION_MAX);
    const affinity = Object.fromEntries(
      SURFACES.map((s) => [s, Math.random()]),
    ) as IHorse["surfaceAffinity"];

    horses.push({
      id: `H${String(i + 1).padStart(2, "0")}`,
      name,
      color: colorList[i]!,
      baseCondition: base,
      currentCondition: base,
      surfaceAffinity: affinity,
      lastRaceRound: undefined,
    });
  }
  return horses;
};

export { generateHorseName, generateHorses };
