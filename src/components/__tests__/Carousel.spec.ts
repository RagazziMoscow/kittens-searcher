import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex, { Store } from "vuex";
import { nextTick } from 'vue';

import Carousel from "@/components/Carousel.vue";
import { StateType} from "@/store/state";
import { state } from "@/store/state";
import mutations from "@/store/mutations";
import getters from "@/store/getters";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Carousel component", () => {
  let store: Store<StateType>;

  beforeEach(() => {
    store = new Vuex.Store({
      state,
      mutations,
      getters
    });
  });

  it("stops the carousel when it is hovered", async () => {
    const wrapper = shallowMount<Carousel>(Carousel, {
      store,
      localVue,
      provide: () => ({
        openDialog: jest.fn()
      })
    });
    const carousel = wrapper.find(".carousel");

    expect(wrapper.vm.movingInterval).toBeNull();
    wrapper.vm.initCarousel();
    await nextTick();
    expect(wrapper.vm.movingInterval).not.toBeNull();
    carousel.trigger("mouseover");
    await nextTick();
    expect(wrapper.vm.movingInterval).toBeNull();
    carousel.trigger("mouseout");
    await nextTick();
    expect(wrapper.vm.movingInterval).not.toBeNull();
  });
});
