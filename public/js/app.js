var firebaseConfig = {
  apiKey: "AIzaSyDQlRwgMXE8cafsyI7CvxdR657qFinEW_Y",
  authDomain: "navigus-assignment-1-d47ab.firebaseapp.com",
  databaseURL: "https://navigus-assignment-1-d47ab.firebaseio.com",
  projectId: "navigus-assignment-1-d47ab",
  storageBucket: "navigus-assignment-1-d47ab.appspot.com",
  messagingSenderId: "843428926817",
  appId: "1:843428926817:web:14608bd719fbbec50be120",
  measurementId: "G-EDBE1K3Q7Q",
};
// Initialize Firebase
var project = firebase.initializeApp(firebaseConfig);
console.log(project);
firebase
  .auth()
  .signOut()
  .catch(function (err) {
    console.log(error.message);
  });
//firebase.analytics();
var avatarList = {
  1: "https://api.adorable.io/avatars/60/abott@adorable.png",
  2: "https://api.adorable.io/avatars/60/qetn5k@adorable.io.png",
  3: "https://api.adorable.io/avatars/60/cool@adorable.io.png",
  4: "https://api.adorable.io/avatars/60/rjkberu@adorable.io.png",
  5: "https://api.adorable.io/avatars/60/akdrgoeir@adorable.io.png",
};

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
/*
firebase
  .app()
  .auth()
  .onAuthStateChanged(function (user) {
    if (user) {
      var userid = firebase.auth().currentUser.uid;
      console.log("Logged in with " + userid);
      window.location.href = "../main_page.html";
    } else {
      window.alert("Some error");
    }
  });
*/
function login() {
  var userEmail = document.getElementById("signin_email").value;
  var userPass = document.getElementById("signin_password").value;

  console.log("Logging in...");
  console.log(userEmail);
  //console.log(userPass);
  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPass)
    .then(function () {
      var userid = firebase.auth().currentUser.uid;
      sessionStorage.setItem("userId", userid);
      var db = firebase.firestore();
      db.collection("Users")
        .doc(userid)
        .update({
          Status: "online",
        })
        .then(() => {
          window.location.href = "../main_page.html";
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          window.alert("Error : " + errorMessage);
        });
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      window.alert("Error : " + errorMessage);
    });
}

function register() {
  var userName = document.getElementById("signup_username").value;
  var userEmail = document.getElementById("signup_email").value;
  var userPass = document.getElementById("signup_password").value;

  console.log("Registering...");
  console.log(userEmail);
  console.log(userPass);
  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPass)
    .then(() => {
      var userid = firebase.auth().currentUser.uid;
      console.log("Updating user-list database with " + userid);
      /*
      firebase
        .database()
        .ref()
        .child("user_list/" + userid)
        .update({
          Username: userName,
          Email: userEmail,
          Status: 1,
        })
        .then(function (success) {
          console.log("Database updated successfully.");
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          window.alert("Error : " + errorMessage);
        });*/
      var db = firebase.firestore();
      db.collection("Users")
        .doc(userid)
        .set({
          Username: userName,
          Email: userEmail,
          Status: "online",
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          console.log("Database updated.");
          sessionStorage.setItem("userId", userid);
          window.location.href = "../main_page.html";
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          window.alert("Error : " + errorMessage);
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          window.alert("Error : " + errorMessage);
        });
    });
}

function showlist(doc, i) {
  //console.log(doc.data);
  userid = sessionStorage.getItem("userId");
  const onlineList = document.querySelector("#online_list");
  const userList = document.querySelector("#user_list");

  let li = document.createElement("li");
  let index = document.createElement("span");
  let username = document.createElement("span");
  let time = document.createElement("span");
  let status = document.createElement("span");
  let image = document.createElement("img");

  li.setAttribute("userid", doc.id);
  index.textContent = i;
  username.textContent = doc.data().Username;
  time.textContent = doc.data().lastSeen.toDate();
  status.textContent = doc.data().Status;

  if (status.textContent === "online") {
    time.style.display = "none";
    image.setAttribute("userid", doc.id);
    var k = Math.floor(Math.random() * 5) + 1;
    image.src = avatarList[k];
    image.title = doc.data().Username;
    onlineList.appendChild(image);
  }
  li.append(index);
  li.append(username);
  li.append(status);
  li.append(time);

  userList.appendChild(li);
}

function getData() {
  /*
  db.collection("Users")
    .get()
    .then(function (snapshot) {
      snapshot.docs.forEach((doc) => {
        showlist(doc);
      });
    });
    */
  var db = firebase.firestore();
  var i = 1;
  db.collection("Users").onSnapshot(() => {
    document.getElementById("user_list").innerHTML = "";
    document.getElementById("online_list").innerHTML = "";
    db.collection("Users")
      .get()
      .then(function (snapshot) {
        snapshot.docs.forEach((doc) => {
          showlist(doc, i);
          i += 1;
        });
      });
  });
}

function signout_user() {
  //window.alert("Its working");
  //var userid = firebase.auth().currentUser.uid;
  var userid = sessionStorage.getItem("userId");
  var db = firebase.firestore();
  db.collection("Users")
    .doc(userid)
    .update({
      Status: "offline",
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log("Database details updated.");
      firebase
        .auth()
        .signOut()
        .then(function () {
          console.log("Logged out successfully.");
          window.location.href = "../index.html";
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode);
          window.alert("Error : " + errorMessage);
        });
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      window.alert("Error : " + errorMessage);
    });
}
