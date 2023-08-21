<template>
  <div>
    <div class="carousel" @mouseout="onMouseOut" @mouseover="onMouseOver">
      <div class="inner" ref="inner" :style="innerStyles">
        <div class="slide" v-for="cat in cats" :key="cat.id">
          <img :src="getCatImage(cat)" :alt="cat.name" @click="showDetailInformation(cat)" />

          <div class="content">
            <div class="text"><h4>{{ cat.name }}</h4></div>
            <button class="button" @click="adoptCurrentCat(cat)">Adopt</button>
          </div>
        </div>
      </div>

      <div class="buttons" v-if="isMovingAllowed">
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

  private movingInterval: ReturnType<typeof setInterval> | null = null;
  private innerStyles: Record<string, string> = {};
  private step = "";
  private transitioning = false;
  private isConfirmDialogOpened = false;
  private cats: Cat[] = [];

  private get isMovingAllowed(): boolean {
    return this.cats.length > 2;
  }

  @Watch("availableCats")
  private onAvailableCatsChanged(): void {
    this.stopMoving();
    this.initCarousel();
  }

  @Inject("openDialog") readonly openDialog!: (dialogType: DialogType, options: DialogOptions) => void;

  private mounted(): void {
    window.addEventListener("resize", this.onWindowResize);
    this.initCarousel();
  }

  private destroyed(): void {
    window.removeEventListener("resize", this.onWindowResize);
    this.stopMoving();
  }

  private initCarousel(isCats = true): void {
    isCats && this.setCats();
    this.setStep();
    this.$nextTick(() => {
      if (this.isMovingAllowed) {
        this.runMoving();
      } else {
        this.resetTransform();
      }
    });
  }

  private setCats(): void {
    this.cats = this.availableCats.sort((catOne, catTwo) => catOne.age - catTwo.age).slice(0, 4);
  }

  private setStep(): void {
    const inner = this.inner;
    const innerWidth = Math.min(inner.clientWidth, inner.offsetWidth, inner.scrollWidth);
    const totalSlides = this.cats.length;

    this.step = `${innerWidth / totalSlides}px`;
  }

  private runMoving(): void {
    this.movingInterval = setInterval(this.next, 2000);
  }

  private stopMoving(): void {
    // eslint-disable-next-line no-undef
    clearInterval(this.movingInterval as NodeJS.Timer);
    this.movingInterval = null;
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

  private resetTransform(): void {
    this.innerStyles = {
      transform: "none"
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

  private onWindowResize(): void {
    this.stopMoving();
    this.initCarousel(false);
  }

  private onMouseOver(): void {
    this.stopMoving();
  }

  private onMouseOut(): void {
    (this.cats.length > 2 && !this.isConfirmDialogOpened) && this.runMoving();
  }

  private getCatImage(cat: Cat) {
    const images = require.context("../database/images/", false, /\.jpeg$/);
    return images("./" + cat.name + ".jpeg");
  }

  private adoptCurrentCat(cat: Cat): void {
    const dialogOptions: ConfirmDialogOptions = {
      title: "Adopt cat",
      text: "Are you sure you want to adopt this cat ?",
      action: () => this.adoptCat(cat),
      onOpen: () => this.onConfirmDialogOpen(),
      onClose: () => this.runMoving()
    };

    this.openDialog(DialogType.CONFIRM_DIALOG, dialogOptions);
  }

  private onConfirmDialogOpen(): void {
    this.isConfirmDialogOpened = true;
    this.stopMoving();
  }

  private showDetailInformation(cat: Cat): void {
    this.openDialog(DialogType.DETAIL_DIALOG, { cat });
  }
}
</script>

<style lang="scss">
@import "../styles/variables";

$size-ratio: 2.03;
$extra-small-size: 100px;
$small-size: 200px;
$medium-size: 500px;

.carousel {
  $slides-moving-time: 0.4s;
  $slides-zooming-time: 0.2s;

  overflow: hidden;
  margin: 20px auto;
  position: relative;

  .inner {
    white-space: nowrap;
    transition: transform $slides-moving-time;
  }

  .slide {
    display: inline-flex;
    justify-content: center;
    position: relative;
    margin-right: 4px;
    border-radius: 4px;
    background-color: green;
    color: white;

    img {
      width: 100%;
      object-fit: cover;
      transition: transform $slides-zooming-time;

      &:hover {
        cursor: pointer;
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
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border-width: 0;
      background-color: $color-brown;
      color: white;
      font-weight: bold;
      font-size: 25px;
    }
  }
}

@media (max-width: $extra-small-width) {
  .carousel {
    width: $extra-small-size * $size-ratio;

    .slide {
      width: $extra-small-size;
      height: $extra-small-size;
    }

    .buttons {
      button {
        width: 25px;
        height: 25px;
        font-size: 16px;
      }
    }
  }
}

@media (min-width: $extra-small-width) and (max-width: $medium-width) {
  .carousel {
    width: $small-size * $size-ratio;

    .slide {
      width: $small-size;
      height: $small-size;
    }
  }
}

@media (min-width: $medium-width) {
  .carousel {
    width: $medium-size * $size-ratio;

    .slide {
      width: $medium-size;
      height: $medium-size;
      margin-right: 10px;
    }
  }
}
</style>
