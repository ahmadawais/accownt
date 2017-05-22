import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class SetAppOTP extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { enabled: this.props.enabled, qr: '' };
  }

  /**
   * Disable app OTP 2FA.
   */
  onDisable() {
    request
      .put('api/dashboard/user/security/otp')
      .send({ remove: true })
      .end((err, res) => {
        if (!err && !res.body.error) this.setState({ enabled: false });
        this.props.alert(res.body.message);
      });
  }

  /**
   * Enable app OTP 2FA.
   */
  onEnable() {
    request
      .put('api/dashboard/user/security/otp')
      .end((err, res) => {
        if (err || res.body.error)
          this.props.alert(res.body.message)
        else
          this.setState(res.body);
      });
  }

  /**
   * Verify token and finish enabling app OTP 2FA.
   */
  onVerify() {
    request
      .put('api/dashboard/user/security/otp')
      .send({
        token: this.refs.code.getField().value
      })
      .end((err, res) => {
        if (err || res.body.error)
          this.props.alert(res.body.message)
        else
          location.reload();
      });
  }
  
  render() {
    return (
      <div className='app-otp section flex'>
        <p>
          Enter in a code that will be provided to apps like Authy, Google Authenticator, etc.
          <br />
          Will remove phone and sms verification from account if enabled.
        </p>

        {this.state.enabled ? (
          <Button
            secondary raised
            label='Disable'
            onClick={() => this.onDisable()}
          />
        ) : this.state.qr ? (
          <div className='verify-app-otp flex'>
            <p>
              Scan the following QR code into your app (Authy, Google Authenticator, etc) and enter the 6 digit code it generates.
            </p>

            <img src={this.state.qr} />
            
            <TextField
              id='text--app-otp-code'
              ref='code'
              type='text'
              label='Code'
              className='md-cell'
            />
            
            <Button
              primary raised
              label='Verify'
              onClick={() => this.onVerify()}
            />
          </div>
        ) : (
          <Button
            primary raised
            label='Enable'
            onClick={() => this.onEnable()}
          />
        )}
      </div>
    );
  }
  
}

SetAppOTP.propTypes = {
  alert: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired
};