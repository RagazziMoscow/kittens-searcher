import { shallowMount, createLocalVue  } from "@vue/test-utils";
import Vuex, { Store } from "vuex";

import Cards from "@/components/Cards.vue";
import { StateType} from "@/store/state";
import { state } from "@/store/state";
import mutations from "@/store/mutations";
import getters from "@/store/getters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Cards component", () => {
  let store: Store<StateType>;

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      mutations,
      getters
    });
  });

  it("shows cats like an array", () => {
    const wrapper = shallowMount<Cards>(Cards, {
      store,
      localVue,
      provide: () => ({
        openDialog: jest.fn()
      })
    });

    expect(Array.isArray(wrapper.vm.cats)).toBeTruthy();
  });

  it("is sorted by age", () => {
    const wrapper = shallowMount<Cards>(Cards, {
      store,
      localVue,
      provide: () => ({
        openDialog: jest.fn()
      })
    });
    const catOne = wrapper.vm.cats[0];
    const catTwo = wrapper.vm.cats[1];

    expect(catOne.age).toBeLessThan(catTwo.age);
  });

  it("removes a cat after adopting", () => {
    const wrapper = shallowMount<Cards>(Cards, {
      store,
      localVue,
      provide: () => ({
        openDialog: jest.fn()
      })
    });
    const catToBeAdopted = wrapper.vm.cats[0];
    mutations.adoptCat(store.state, catToBeAdopted);

    expect(store.state.adoptedCats.includes(catToBeAdopted)).toBeTruthy();
    expect(store.getters.availableCats.includes(catToBeAdopted)).toBeFalsy();
  });
});
