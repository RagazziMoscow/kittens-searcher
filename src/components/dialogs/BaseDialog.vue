<template>
  <component v-model="isShown" :is="dialogComponent" v-bind="dialogOptions" />
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue, Watch } from "vue-property-decorator";
import { DialogOptions, DialogType, ImportedComponent } from "@/models";

const AVAILABLE_DIALOGS = new Map<DialogType, ImportedComponent>([
  [DialogType.DETAIL_DIALOG, () => import("./DetailDialog.vue")],
  [DialogType.CONFIRM_DIALOG, () => import("./ConfirmDialog.vue")]
]);

@Component
export default class BaseDialog extends Vue {
  @VModel({ type: Boolean }) isShown!: boolean;

  @Prop({ type: String }) readonly dialogType!: DialogType;
  @Prop({ type: Object }) readonly dialogOptions!: DialogOptions;

  private dialogComponent: ImportedComponent | null = null;

  @Watch("isShown")
  private onIsShownChanged(isShown: boolean): void {
    if (isShown && this.dialogType) {
      this.setDialogComponent();
    }
  }

  private async setDialogComponent(): Promise<void> {
    const component = AVAILABLE_DIALOGS.get(this.dialogType);
    this.dialogComponent = component as ImportedComponent;
  }
}
</script>
