import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import initialization, { setSessionStorage } from "../frontend/static/js/store";

let userData = "";
let userLogin = false;
let userIsReady = false

function createUser(user) {
  const { username, email, password, score} = user;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("CREATED");
      updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: score,
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error-create", error);
      return "ERROR_AT_ AUTH" + error;
    });
}

function login(user) {
  const { email, password } = user;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // statusChange()
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

//   setPersistence(auth, browserSessionPersistence)
//  .then(() => {
//    // Existing and future Auth states are now persisted in the current
//    // session only. Closing the window would clear any existing state even
//    // if a user forgets to sign out.
//    // ...
//    // New sign-in will be persisted with session persistence.
//    return signInWithEmailAndPassword(auth, email, password);
//  })
//  .catch((error) => {
//    // Handle Errors here.
//    const errorCode = error.code;
//    const errorMessage = error.message;
//  });

function setUser(user) {
  if (user) {
    userData = {
      uid: user.uid,
      name: user.displayName,
      score: Number(user.photoURL),
    };
    userLogin = true;
    console.log("LOGIN", userData, userLogin);
    
  } else {
    userData = "";
    userLogin = false;
    console.log("LOGOUT");
  }
}
function getAllUsers() {
  const listAllUsers = (nextPageToken) => {
    // List batch of users, 1000 at a time.
    auth
      .listUsers(1000, nextPageToken)
      .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
          console.log('user', userRecord.toJSON());
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  };
  // Start listing users from the beginning, 1000 at a time.
  listAllUsers();
}

async function logout() {
  await signOut(auth);
  // statusChange()
  console.log("signout");
}

onAuthStateChanged(auth, (user) => {
    console.log("IN_UNSUB");
    setUser(user);
    userIsReady = true
    console.log("ready",userIsReady)
    initialization(userLogin)
    });

export { 
  login, 
  logout, 
  createUser, 
  getAllUsers,
  userData, 
  userLogin, 
  userIsReady };
