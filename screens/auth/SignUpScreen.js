import React from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';
import I18n from '../../i18n';
import authService from '../../services/AuthService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Sentry from 'sentry-expo';

export default class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign up'
  };

  state = {
    name: '',
    email: '',
    password: ''
  };

  static propTypes = {
    navigation: PropTypes.object
  };

  confirmSignUp = () => {
    Alert.alert('Confirm', 'Are you sure that you want to singup with this data?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      { text: 'Yes', onPress: () => this.signUp() }
    ]);
  };

  signUp = async () => {
    const signupData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    try {
      const response = await authService.signup(signupData);
      Alert.alert(I18n.t('common.success'), 'Sign up was successfull!');
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('Main');
    } catch (e) {
      Sentry.captureException(e);
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid style={styles.container}>
        <TextInput
          autoCapitalize="words"
          autoCorrect={false}
          placeholder={I18n.t('auth.enterName')}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />

        <TextInput
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={I18n.t('auth.enterEmail')}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />

        <TextInput
          secureTextEntry={true}
          placeholder={I18n.t('auth.enterPass')}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
            <Text>{I18n.t('auth.haveAccountLogIn')}</Text>
          </TouchableOpacity>
          <Button title={I18n.t('auth.signup')} onPress={this.confirmSignUp} />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
