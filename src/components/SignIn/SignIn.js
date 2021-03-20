import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../firebaseConfig/firebaseConfig";

firebase.initializeApp(firebaseConfig);

const SignIn = () => {
  const [loggedInUser, setLoggedInUser] = useState({
    emailVerified: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false,
  });
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState("");

  const provider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignUp = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const newUser = {
          emailVerified: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setLoggedInUser(newUser);
        console.log(result);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        const newUser = {
          emailVerified: false,
          name: "",
          email: "",
          photo: "",
        };
        setLoggedInUser(newUser);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleBlur = (e) => {
    let isValid = true;
    // if(e.target.name === 'name')
    // {
    //   isValid = e.target.value;
    // }
    if (e.target.name === "email") {
      isValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isOneDigit = /\d{1}/.test(e.target.value);
      const sixCharLong = e.target.value.length > 6;
      isValid = isOneDigit && sixCharLong;
    }

    if (isValid) {
      const newUser = { ...loggedInUser };
      newUser[e.target.name] = e.target.value;
      setLoggedInUser(newUser);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUser && loggedInUser.email && loggedInUser.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          loggedInUser.email,
          loggedInUser.password
        )
        .then((res) => {
          const newUser = { ...loggedInUser };
          newUser.success = true;
          newUser.error = "";
          setLoggedInUser(newUser);
          updateUserName(loggedInUser.name)
          console.log(res);
        })
        .catch((error) => {
          console.log(error.code, error.message);
          const newError = { ...loggedInUser };
          newError.error = error.message;
          newError.success = false;
          setLoggedInUser(newError);
        });
    }
    if (!newUser && loggedInUser.email && loggedInUser.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(loggedInUser.email, loggedInUser.password)
        .then((res) => {
          const loggedIn = { ...loggedInUser };
          loggedIn.success = true;
          setLoggedInUser(loggedIn);
          console.log('signed in user info ', res.user)
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  const updateUserName = (name) => {
    var user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name
      })
      .then(function () {
        console.log('updated user name successfully')
      })
      .catch(function (error) {
        console.log(error)
      });
  };

  const handleFb = () =>{
    firebase
    .auth()
    .signInWithPopup(fbProvider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
  
      // The signed-in user info.
      var user = result.user;
  
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var accessToken = credential.accessToken;
  
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
  
      // ...
    });
  }
  return (
    <div>
      {loggedInUser.emailVerified ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignUp}>Sign In</button>
      )}
      <br/>
      <button onClick={handleFb}>Facebook log in</button>

      {loggedInUser.emailVerified && (
        <div>
          <p>Email: {loggedInUser.email}</p>
          <p>Name: {loggedInUser.name}</p>
          <img style={{ height: "50px" }} src={loggedInUser.photo} alt="" />
        </div>
      )}
      <div>
        <h1>Login Authentication</h1>
        <p>Name: {loggedInUser.name}</p>
        <p>Email : {loggedInUser.email}</p>
        <p>Password : {loggedInUser.password}</p>
        <form action="" onSubmit={handleSubmit}>
          <input
            onChange={() => setNewUser(!newUser)}
            type="checkbox"
            name="newUser"
            id=""
          />
          <label htmlFor="newUser">Create new user</label> <br />
          {newUser && (
            <input name="name" onBlur={handleBlur} type="text" required />
          )}
          <br />
          <input type="email" onBlur={handleBlur} name="email" id="" required />
          <br />
          <input
            type="password"
            onBlur={handleBlur}
            name="password"
            id=""
            required
          />
          <br />
          <input type="submit" value="submit" />
        </form>
        <p style={{ color: "red" }}>{loggedInUser.error}</p>
        {loggedInUser.success && (
          <p style={{ color: "green" }}>
            your account has {newUser ? "created " : "logged in "}successful
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
