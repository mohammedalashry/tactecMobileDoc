import {TxKeyPath} from '@app/i18n';
import {ToastPresets} from './toast-presets';

export interface ToastProps {
  preset?: ToastPresets;

  message?: string;

  messageTx?: TxKeyPath | undefined | null;

  timeout?: number;
}
