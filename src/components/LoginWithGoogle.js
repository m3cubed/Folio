import React from "react";
import firebase from "firebase";
import { GoogleProvider } from "./base";

class LoginWithGoogle extends React.Component {
  signinWithPopup = () => {
    firebase
      .auth()
      .signInWithPopup(GoogleProvider)
      .then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error);
      });
  };

  render() {
    return (
      <span
        style={{ textAlign: "center" }}
        onClick={this.signinWithPopup}
        className="Google_Button"
      />
    );
  }
}

export default LoginWithGoogle;
