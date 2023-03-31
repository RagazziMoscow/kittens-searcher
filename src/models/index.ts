import Cat from "@/models/Cat";

export enum DialogType {
  DETAIL_DIALOG = "DetailDialog",
  CONFIRM_DIALOG = "ConfirmDialog"
}

export interface ConfirmDialogOptions {
  title: string;
  text: string;
  action: () => void;
}

export type DialogOptions = ConfirmDialogOptions | { cat: Cat };

export type ImportedComponent = (() => Promise<typeof import(".vue")>);
