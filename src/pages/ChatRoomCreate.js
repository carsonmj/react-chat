import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {db, firebaseApp, firebase} from '../firebase';
import { BiSend, BiLogOut, BiCommentAdd} from "react-icons/bi";

const ChatRoomCreate = (props) => {
  const history = useHistory();
  const [channel, setChannel] = useState("");
  const [chats, setChats] = useState("");

  // db.collection('chat').onSnapshot((snapshot) => {
  //   // onSnapshot((snapshot) => {
  //   //   const data = snapshot.docs.map((doc) => ({
  //   //     id: doc.id,
  //   //     ...doc.data(),
  //   //   }));
  //     onSnapshot((snapshot) => {
  //       const data = snapshot.docs.map((doc) => {
  //         id: doc.id
  //         console.log(doc.id);
  //       });
  //       console.log("data", data);
  //     });
  // });

  const onTextareaChange = (evt) => {
    setChannel(evt.target.value);
  }

  const start = () => {
    history.push(`/chat/${channel}`)
  }

  const logout = () => {
    firebaseApp.auth().signOut()
    history.push('/login');
  }

  // var docRef = db.collection("chat").doc();

  // docRef.get().then((doc) => {
  //     console.log("=========");
  //     console.log(doc);
  //     if (doc.exists) {
  //         console.log("Document data:", doc.data());
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //     }
  // }).catch((error) => {
  //     console.log("Error getting document:", error);
  // });

  const roomRef = db.collection('chat')
  roomRef.onSnapshot((snapshot) => {
    console.log("snapshot.size => ", snapshot.size);
    snapshot.docs.map((doc) => {
      console.log("doc.getId => ", doc.getId());
    });
  });

  db.collection("chat").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log("querySnapshot.size => ", querySnapshot.size); 
        console.log(doc.id, " => ", doc.data());
    });
  });




  return <div className="vw100 vh100 flex aic jcc">
    <div className="posFx top0 right0 p8">
      <div className="flex fdr aic cursor_pointer" onClick={evt => {logout()}}>
        <BiLogOut/> 
        <span>Logout</span>
      </div>
    </div>
    <div className="w400 flex fdr aic">
      <input className="default_input f1" placeholder="채널 이름을 입력하세요."
        value={channel} onChange={evt => {onTextareaChange(evt)}}/>
      <div className="btn btn-success ml16 w100" onClick={evt => start()}>Start</div>
    </div>
  </div>
}

export default ChatRoomCreate
