<template>
  <Transition name="modal">
    <div v-if="isShown" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container" style="position: relative">
          <div class="modal-header">
            <h3>Detail Information</h3>
          </div>

          <div class="action">
            <button class="button button--error" @click="close">X</button>
          </div>

          <div class="modal-body">
            <h4>Name: {{ cat.name }}, Age: {{ cat.age }}, Color: {{ cat.color }}</h4>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";
import Cat from "@/models/Cat";

@Component
export default class DetailDialog extends Vue {
  @VModel({ type: Boolean }) isShown!: boolean;

  @Prop({ type: Object, required: true }) readonly cat!: Cat;

  private close(): void {
    this.isShown = false;
  }
}
</script>
