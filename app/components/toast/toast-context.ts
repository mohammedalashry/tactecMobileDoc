import React, {useContext} from 'react';
import {ToastProps} from './toast-props';

const context = React.createContext({
  show: (values: ToastProps) => {
    if (__DEV__) {
      console.log(values);
    }
  },
  hide: () => {
    if (__DEV__) {
      console.log('hide');
    }
  },
});

export default context;

export const useToast = () => {
  return useContext(context);
};
