import { Tag, TagV2 } from "./tag";

import { Note } from "./note";
import { SavedPage } from "./common";
import { StorageKeys } from "@/utils/constant";

export interface Storage {
  [StorageKeys.notes]: Note[];
  [StorageKeys.tags]: Tag[];
  [StorageKeys.collectedPages]: string[];

  [StorageKeys.pages]: SavedPage[];
  [StorageKeys.newTags]: TagV2[];

  
}
