import { StateType } from "@/store/state";
import Cat from "@/models/Cat";

export default {
  adoptCat(state: StateType, cat: Cat): void {
    state.adoptedCats.push(cat);
  }
};
