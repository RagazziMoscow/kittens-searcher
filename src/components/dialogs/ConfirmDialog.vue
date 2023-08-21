<template>
  <Transition name="modal">
    <div v-if="isShown" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>{{ title }}</h3>
          </div>

          <div class="modal-body">
            {{ text }}
          </div>

          <div class="modal-footer">
            <button class="button" @click="confirm">YES</button>
            <button class="button button--error" @click="close">NO</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { Component, Prop, Vue, VModel } from "vue-property-decorator";

@Component
export default class ConfirmDialog extends Vue {
  @VModel({ type: Boolean }) isShown!: boolean;

  @Prop({ type: String, required: true }) readonly title!: string;
  @Prop({ type: String, required: true }) readonly text!: string;
  @Prop({ type: Function, required: true }) readonly action!: () => void;
  @Prop({ type: Function }) readonly onOpen!: () => void;
  @Prop({ type: Function }) readonly onClose!: () => void;

  private mounted(): void {
    if (this.onOpen) {
      this.onOpen();
    }
  }

  private confirm(): void {
    this.action();
    this.close();
  }

  private close(): void {
    this.isShown = false;
    if (this.onClose) {
      this.onClose();
    }
  }
}
</script>
