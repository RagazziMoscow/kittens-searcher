import {DialogType} from "@/models";
<template>
  <div>
    <div class="filter">
      <input type="text" v-model="name" placeholder="Type name of kitten" />

      <form>
        <fieldset>
          <legend>Sorting:</legend>
          <input type="radio" id="asc" :value="true" v-model="isSortingAsc" />
          <label for="asc">ASC</label>

          <input type="radio" id="desc" :value="false" v-model="isSortingAsc" />
          <label for="desc">DESC</label>
        </fieldset>

        <fieldset>
          <legend>Property for sorting:</legend>

          <div>
            <input type="radio" id="name" value="name" v-model="sortingProperty" />
            <label for="name">Name</label>
          </div>
          <div>
            <input type="radio" id="color" value="color" v-model="sortingProperty" />
            <label for="color">Color</label>
          </div>
          <div>
            <input type="radio" id="age" value="age" v-model="sortingProperty" />
            <label for="age">Age</label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Custom filters:</legend>

          <custom-checkbox v-model="isYoungerThanSixMonths" title="Younger than 6 months" />

          <custom-checkbox v-model="isYoungerThanTwelveMonths" title="Younger than 12 months" />

          <custom-checkbox v-model="isBlackColor" title="Black color" />
        </fieldset>
      </form>
    </div>

    <div class="list">
      <div v-for="cat in cats" :key="cat.id" class="card">
        <img :src="getCatImage(cat)" :alt="cat.name">

        <div class="content">
          <div class="text">
            <h4><b><span>{{ cat.name }}</span></b></h4>
            <p><span>Color: {{ cat.color }}, Age: {{ cat.age }}</span></p>
          </div>

          <button class="button" @click="adoptCurrentCat(cat)">Adopt</button>
        </div>
      </div>
    </div>

    <div class="show-more" v-if="isShowMoreButtonVisible">
      <button class="button button--info" @click="showMore">Show More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";

import Cat from "@/models/Cat";
import Color from "@/models/Color";
import { ConfirmDialogOptions, DialogType } from "@/models";

import CustomCheckbox from "./CustomCheckbox.vue";

const PAGE_SIZE = 20;

@Component({
  components: { CustomCheckbox }
})
export default class Cards extends Vue {
  @Getter readonly availableCats!: Cat[];

  @Mutation readonly adoptCat!: (cat: Cat) => void;

  @Inject("openDialog") readonly openDialog!: (dialogType: DialogType, options: ConfirmDialogOptions) => void;

  private name = "";
  private isYoungerThanSixMonths = false;
  private isYoungerThanTwelveMonths = false;
  private isBlackColor = false;
  private isSortingAsc = true;
  private sortingProperty: keyof Cat = "age";
  private limit = PAGE_SIZE;

  private get cats(): Cat[] {
    const filteredCats = this.availableCats
      .filter(cat => this.name ? cat.name.toLowerCase().includes(this.name.toLowerCase()) : true)
      .filter(cat => this.isYoungerThanSixMonths ? cat.age < 0.5 : true)
      .filter(cat => this.isYoungerThanTwelveMonths ? cat.age < 1 : true)
      .filter(cat => this.isBlackColor ? cat.color === Color.BLACK : true)
      .slice(0, this.limit);

    return filteredCats.sort((catOne: Cat, catTwo: Cat): number => {
      if (typeof catOne[this.sortingProperty] === "number") {
        return this.isSortingAsc
          ? (catOne[this.sortingProperty] as number) - (catTwo[this.sortingProperty] as number)
          : (catTwo[this.sortingProperty] as number) - (catOne[this.sortingProperty] as number);
      } else {
        return this.isSortingAsc
          ? (catOne[this.sortingProperty] as string).localeCompare(catTwo[this.sortingProperty] as string)
          : (catTwo[this.sortingProperty] as string).localeCompare(catOne[this.sortingProperty] as string);
      }
    });
  }

  private get isShowMoreButtonVisible(): boolean {
    return this.cats.length !== this.availableCats.length && this.cats.length >= PAGE_SIZE;
  }

  private showMore(): void {
    this.sortingProperty = "age";
    this.limit += PAGE_SIZE;
  }

  private getCatImage(cat: Cat) {
    const images = require.context("../database/images/", false, /\.jpeg$/);
    return images("./" + cat.name + ".jpeg");
  }

  private adoptCurrentCat(cat: Cat): void {
    const dialogOptions: ConfirmDialogOptions = {
      title: "Adopt cat",
      text: "Are you sure you want to adopt this cat ?",
      action: () => this.adoptCat(cat)
    };

    this.openDialog(DialogType.CONFIRM_DIALOG, dialogOptions);
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

  .filter {
    width: 100vw;
    padding: 0 30px;
    box-sizing: border-box;

    fieldset {
      margin: 0 5px;
      padding: 10px;
    }

    input[type="text"] {
      height: 35px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 5px;
      border-color: $color-green;
    }

    form {
      display: flex;
      justify-content: space-between;
    }

    input[type="checkbox"] {
      width: 15px;
      height: 15px;
      accent-color: #3ba500;
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    $card-width: 17%;

    .card {
      margin: 10px;
      height: 300px;

      position: relative;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;

      img {
        width: 100%;
        max-height: 70%;
        object-fit: cover;
      }
    }

    .card:hover {
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
  }

@media (max-width: $small-width) {
  .filter {
    form {
      flex-direction: column;
    }

    fieldset {
      width: 100%;
    }
  }

  .card {
    flex: 1 0 65%;
    max-width: 70%;
  }
}

@media (min-width: $small-width) {
  fieldset {
    width: calc(100% / 3);
  }
}

@media (min-width:$small-width) and (max-width: $medium-width) {
  .card {
    flex: 1 0 30%;
    max-width: 30%;
  }
}

@media (min-width: $medium-width) {
  .card {
    flex: 1 0 17%;
    max-width: 17%;
  }
}
</style>
