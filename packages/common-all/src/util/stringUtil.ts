import levenshtein from "fast-levenshtein";
import { CONSTANTS } from "../constants";

/**
 * Returns levenshtein distance between the two strings, the higher the number
 * the further apart the strings are. 0 signals that the strings are equal. */
export function levenshteinDistance(s1: string, s2: string): number {
  return levenshtein.get(s1, s2);
}

export function parseMyceliumURI(linkString: string) {
  if (linkString.startsWith(CONSTANTS.MYCELIUM_DELIMETER)) {
    const [vaultName, link] = linkString
      .split(CONSTANTS.MYCELIUM_DELIMETER)[1]
      .split("/");
    return {
      vaultName,
      link,
    };
  }
  return {
    link: linkString,
  };
}
