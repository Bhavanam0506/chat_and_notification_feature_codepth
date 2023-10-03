import logo from './logo.svg';
import './App.css';
//import firebase from 'firebase/app';
import firebase from 'firebase/compat/app';
//import { auth } from "firebase";
//console.log(auth);
//import 'firebase/firestore';
//import 'firebase/auth';
import { getAuth } from "firebase/auth";
import 'firebase/analytics';
//import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useRef, useState } from 'react';
firebase.initializeApp({
  apiKey: "AIzaSyBVE2obwK5XYJ12olrIhsmjgvv-f9Mbgsg",
  authDomain: "chatapp-a590b.firebaseapp.com",
  projectId: "chatapp-a590b",
  storageBucket: "chatapp-a590b.appspot.com",
  messagingSenderId: "174805230918",
  appId: "1:174805230918:web:6efeaff28c2541c69bf147",
  measurementId: "G-7WQ5MYVQ6H"

})

//const auth = firebase.auth();
const auth = getAuth();
const firestore= firebase.firestore();

//const analytics = firebase.analytics();


function App() {
  const [user]=useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <h1>⚛️Chat Now💬</h1>
        <SignOut />
       
      </header>
      <section>
        {user ? <ChatRoom/>:<SignIn/>}
      </section>
    </div>
  );
}

function SignIn()
{
  const signInWithGoogle = () =>{
    //const provider = new firebase.auth.GoogleAuthProvider();
    //auth.signInWithPopup(provider);
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());


  }
  return(
    <button onClick={signInWithGoogle}>Sign in with google</button>
  )
}

function SignOut(){
  return auth.currentUser &&(
    <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messagesRef= firestore.collect('message');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
    return (<>
      <main>
  
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  
        <span ref={dummy}></span>
  
      </main>
  
      <form onSubmit={sendMessage}>
  
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
  
        <button type="submit" disabled={!formValue}>🕊️</button>
  
      </form>
    </>)
  }
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}
export default App;
