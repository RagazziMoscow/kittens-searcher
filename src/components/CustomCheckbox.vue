<template>
  <label class="container">
   {{ title }}
    <input type="checkbox" v-model="isChecked">
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class CustomCheckbox extends Vue {
  @VModel({ type: Boolean }) isChecked!: boolean;

  @Prop({ type: String, required: true }) readonly title!: string;
}
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:checked ~ .checkmark {
      background-color: $color-green;
    }

    &:checked ~ .checkmark:after {
      display: block;
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;

    &:after {
      content: "";
      position: absolute;
      display: none;
      left: 9px;
      top: 5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  &:hover {
    .checkmark {
      background-color: $color-green;
    }
  }
}
</style>
