/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TextInput, Text, View } from 'react-native';

import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
import Color from './Color';

export default class Composer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        text: this.props.text
    };
  }

  onContentSizeChange(e) {
    const { contentSize } = e.nativeEvent;

    // Support earlier versions of React Native on Android.
    if (!contentSize) return;

    if (
        !this.contentSize ||
        this.contentSize.width !== contentSize.width ||
        this.contentSize.height !== contentSize.height
    ) {
        this.contentSize = contentSize;
        this.props.onInputSizeChanged(this.contentSize);
    }
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  clearText(){
    // Applied this fix rom this link.
    // https://github.com/facebook/react-native/issues/18767#issuecomment-403685280
    // TODO: Update this library as soon they have migrated to RN >= 0.57, and then revert all of this stuff.

    this._textInput.setNativeProps({ text: ' ' });

    setTimeout(() => {
      this._textInput.setNativeProps({ text: '' });
    },5);
  }

  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}
        onChange={(e) => this.onContentSizeChange(e)}
        onContentSizeChange={(e) => this.onContentSizeChange(e)}
        onChangeText={(text) => this.onChangeText(text)}
        style={[styles.textInput, this.props.textInputStyle, { height: this.props.composerHeight }]}
        autoFocus={this.props.textInputAutoFocus}
        value={this.props.text}
        accessibilityLabel={this.state.text || this.props.placeholder}
        enablesReturnKeyAutomatically
        underlineColorAndroid="transparent"
        keyboardAppearance={this.props.keyboardAppearance}
        blurOnSubmit={false}
        ref={component => this._textInput = component}
        onSubmitEditing={() => {
          this.clearText()
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
        ios: 6,
        android: 0,
    }),
    marginBottom: Platform.select({
        ios: 5,
        android: 3,
    }),
  },
});

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: Color.defaultProps,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: 'default',
  onTextChanged: () => {},
  onInputSizeChanged: () => {}
};

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  reset: PropTypes.bool,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string
};
