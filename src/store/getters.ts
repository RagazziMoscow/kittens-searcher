import { StateType } from "@/store/state";
import Cat from "@/models/Cat";

export default {
  availableCats(state: StateType): Cat[] {
    return state.cats.filter(cat => !state.adoptedCats.includes(cat));
  }
};
