<template>
  <div>
    <base-dialog v-model="isDialogOpened" :dialog-type="dialogType" :dialog-options="dialogOptions" />

    <carousel />

    <cards />
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";

import { DialogOptions, DialogType } from "@/models";

import BaseDialog from "@/components/dialogs/BaseDialog.vue";
import Carousel from "@/components/Carousel.vue";
import Cards from "@/components/Cards.vue";

@Component({
  components: {
    BaseDialog,
    Carousel,
    Cards
  }
})
export default class Layout extends Vue {
  private isDialogOpened = false;
  private dialogType: DialogType | null = null;
  private dialogOptions: DialogOptions | null = null;

  @Provide("openDialog")
  private openConfirmDialog(dialogType: DialogType, options?: DialogOptions): void {
    this.dialogType = dialogType;
    this.dialogOptions = options || this.dialogOptions;
    this.isDialogOpened = true;
  }
}
</script>
