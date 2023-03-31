import {DialogType} from "@/models";
<template>
  <div>
    <div class="carousel" @mouseout="runMoving" @mouseover="stopMoving">
      <div class="inner" ref="inner" :style="innerStyles">
        <div class="slide" v-for="cat in cats" :key="cat.id">
          <img :src="getCatImage(cat)" :alt="cat.name" @click="showDetailInformation(cat)" />

          <div class="content">
            <div class="text"><h4>{{ cat.name }}</h4></div>
            <button class="button" @click="adoptCurrentCat(cat)">Adopt</button>
          </div>
        </div>
      </div>

      <div class="buttons">
        <button @click="prev">&lt;</button>
        <button @click="next">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Ref, Vue, Watch } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";

import Cat from "@/models/Cat";
import { ConfirmDialogOptions, DialogOptions, DialogType } from "@/models";

@Component
export default class Carousel extends Vue {
  @Getter readonly availableCats!: Cat[];

  @Mutation readonly adoptCat!: (cat: Cat) => void;

  @Ref("inner") inner!: HTMLElement;

  private innerStyles = {};
  private step = "";
  private transitioning = false;
  private movingInterval: number | null = null;
  private cats: Cat[] = [];

  @Watch("availableCats")
  private onAvailableCatsChanged(): void {
    this.setCats();
    this.setStep();
  }

  @Inject("openDialog") readonly openDialog!: (dialogType: DialogType, options: DialogOptions) => void;

  private mounted(): void {
    this.setCats();
    this.setStep();
    this.runMoving();
  }

  private setCats(): void {
    this.cats = this.availableCats.sort((catOne, catTwo) => catOne.age - catTwo.age).slice(0, 4);
  }

  private setStep(): void {
    const innerWidth = this.inner.scrollWidth;
    const totalSlides = this.cats.length;

    this.step = `${innerWidth / totalSlides}px`;
  }

  private runMoving(): void {
    this.movingInterval = setInterval(this.next, 2000);
  }

  private stopMoving(): void {
    clearInterval(this.movingInterval as number);
  }

  private next(): void {
    if (this.transitioning) return;

    this.transitioning = true;
    this.moveLeft();
    this.afterTransition(() => {
      const cat = this.cats.shift();

      if (cat) {
        this.cats.push(cat);
        this.resetTranslate();
        this.transitioning = false;
      }
    });
  }

  private prev(): void {
    if (this.transitioning) return;

    this.transitioning = true;
    this.moveRight();
    this.afterTransition(() => {
      const cat = this.cats.pop();

      if (cat) {
        this.cats.unshift(cat);
        this.resetTranslate();
        this.transitioning = false;
      }
    });
  }

  private moveLeft(): void {
    this.innerStyles = {
      transform: `translateX(-${this.step})
                  translateX(-${this.step})`
    };
  }

  private moveRight(): void {
    this.innerStyles = {
      transform: `translateX(${this.step})
                  translateX(-${this.step})`
    };
  }

  private afterTransition(callback: () => void): void {
    const listener = () => {
      callback();
      this.inner.removeEventListener("transitionend", listener);
    };
    this.inner.addEventListener("transitionend", listener);
  }

  private resetTranslate(): void {
    this.innerStyles = {
      transition: "none",
      transform: `translateX(-${this.step})`
    };
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

  private showDetailInformation(cat: Cat): void {
    this.openDialog(DialogType.DETAIL_DIALOG, { cat });
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

.carousel {
  $slides-moving-time: 0.4s;
  $slides-zooming-time: 0.2s;
  $buttons-size: 40px;

  overflow: hidden;
  margin: 0 auto;
  position: relative;

  .inner {
    white-space: nowrap;
    transition: transform $slides-moving-time;
  }

  .slide {
    display: inline-flex;
    justify-content: center;
    position: relative;
    margin-right: 10px;
    border-radius: 4px;
    background-color: green;
    color: white;

    img {
      width: 100%;
      object-fit: cover;
      transition: transform $slides-zooming-time;

      &:hover {
        transform: scale(1.5);
      }
    }
  }

  .buttons {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;

    button {
      margin: 10px 5px;
      width: $buttons-size;
      height: $buttons-size;
      border-radius: 50%;
      border-width: 0;
      background-color: $color-brown;
      color: white;
      font-weight: bold;
      font-size: 25px;
    }
  }
}

@media (max-width: $medium-width) {
  .carousel {
    width: 300px;

    .slide {
      width: 150px;
      height: 150px;
    }
  }
}

@media (min-width: $medium-width) {
  .carousel {
    width: 610px;

    .slide {
      width: 300px;
      height: 300px;
    }
  }
}
</style>
