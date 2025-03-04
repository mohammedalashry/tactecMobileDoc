import React, {Component} from 'react';

import {StyleSheet, Platform, Animated} from 'react-native';
import {Icon} from '../icon/icon';
import {Text} from '../text/text';
import {color} from '@theme/color';
import {ToastProps} from './toast-props';
import {translate} from '@app/i18n';
import {presets} from './toast-presets';

import ToastContext from './toast-context';

class Toast extends Component {
  state = {
    message: '',
    messageTx: null,
    preset: 'default',
    timeout: 3000,
  };

  top = new Animated.Value(-91);

  show = async (props: ToastProps) => {
    await this.setState({
      ...props,
    });

    await Animated.timing(this.top, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setTimeout(this.hide, props.timeout || this.state.timeout);
  };

  hide = () => {
    Animated.timing(this.top, {
      toValue: -1000,
      duration: 200,
      useNativeDriver: false,
    }).start();

    this.setState({
      message: '',
      messageTx: null,
      preset: 'default',
      timeout: 3000,
    });
  };

  render(): React.ReactNode {
    const messageToShow =
      this.state.messageTx !== null
        ? translate(this.state.messageTx)
        : this.state.message;
    return (
      <ToastContext.Provider
        value={{
          show: this.show,
          hide: this.hide,
        }}>
        <Animated.View
          style={[
            styles.container,
            presets[this.state.preset || 'default'],
            {top: this.top},
          ]}>
          <Icon
            type="material"
            color={color.palette.white}
            size={20}
            name="check-circle-outline"
          />
          <Text style={styles.messageText}>
            {messageToShow || 'Something went wrong!'}
          </Text>
        </Animated.View>

        {this.props.children}
      </ToastContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 91,
    paddingBottom: 10,
    paddingLeft: 26,
    paddingRight: 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  messageText: {
    color: color.palette.white,
    marginLeft: 10,
    marginRight: 10,
  },
});

export {Toast};
