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

async function createUser(user) {
  const { username, email, password, score} = user;
  await createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      updateProfile(auth.currentUser, {
        displayName: username,
      }).then(() => authChange())
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error-create", error);
      return "ERROR_AT_ AUTH" + error.message;
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
    };
    userLogin = true;
    console.log("LOGIN", userData, userLogin);
    
  } else {
    userData = "";
    userLogin = false;
    console.log("LOGOUT");
  }
}
function getUserData() {
  console.log("IN_USERDATA")
  return userData
}
// function getAllUsers() {
//   const listAllUsers = (nextPageToken) => {
//     // List batch of users, 1000 at a time.
//     auth
//       .listUsers(1000, nextPageToken)
//       .then((listUsersResult) => {
//         listUsersResult.users.forEach((userRecord) => {
//           console.log('user', userRecord.toJSON());
//         });
//         if (listUsersResult.pageToken) {
//           // List next batch of users.
//           listAllUsers(listUsersResult.pageToken);
//         }
//       })
//       .catch((error) => {
//         console.log('Error listing users:', error);
//       });
//   };
//   // Start listing users from the beginning, 1000 at a time.
//   listAllUsers();
// }

async function logout() {
  await signOut(auth);
  // statusChange()
  console.log("signout");
}

function authChange() {
  onAuthStateChanged(auth, (user) => {
    console.log("IN_UNSUB");
    setUser(user);
    userIsReady = true
    console.log("ready",userIsReady)
    initialization(userLogin)
    });
}
authChange()

export { 
  login, 
  logout, 
  createUser,
  getUserData,
  getAllUsers,
  userData, 
  userLogin, 
  userIsReady };
