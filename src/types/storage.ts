import { Note } from "./note";
import { StorageKeys } from "@/utils/constant";
import { Tag } from "./tag";

export interface Storage {
  [StorageKeys.notes]: Note[];
  [StorageKeys.tags]: Tag[];
  [StorageKeys.collectedPages]: string[];
}
