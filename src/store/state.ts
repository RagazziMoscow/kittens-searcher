import Cat from "@/models/Cat";
import items from "@/database/source";

export interface StateType {
  cats: Cat[];
  adoptedCats: Cat[];
}

export const state: StateType = {
  cats: items,
  adoptedCats: []
};
