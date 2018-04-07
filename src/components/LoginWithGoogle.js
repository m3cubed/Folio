import React from "react";
import firebase from "firebase";
import { base, config, GoogleProvider } from "./base";
import { Button } from "antd";

const auth = firebase.auth();

class LoginWithGoogle extends React.Component {
  signinWithPopup = () => {
    firebase
      .auth()
      .signInWithPopup(GoogleProvider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  render() {
    return (
      <Button className="Signin_Google_Button" onClick={this.signinWithPopup}>
        <i className="fab fa-google" /> Sign in with Google
      </Button>
    );
  }
}

export default LoginWithGoogle;
