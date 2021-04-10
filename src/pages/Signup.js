import React, {useState, useEffect} from 'react';
import '../App.css';
import {useHistory} from 'react-router-dom';
import {db, firebaseApp, firebase} from '../firebase';
import Spinner from '../components/Spinner';
import Button from "@material-ui/core/Button";

const Signup = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);

  const signup = () => {
    if(email.length < 3) {
      alert('올바른 이메일을 입력해주세요.');
      return
    }

    setLoading(true);
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      const uid = (firebaseApp.auth().currentUser || {}).uid
      if(uid){
        db
        .collection('user')
        .add({
          uid: uid,
          nickName: nickName,
          email: email,
          created: firebase.firestore.Timestamp.now().seconds
        })
        .then((ref) => {
          setLoginStatus(true);
          setUid(uid);
          setEmail("");
          setPassword("");
          history.push('/createChat')
          setLoading(false);
        })
      }else{
        alert('error');
      }
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
      var errorCode = error.code;
      var errorMessage = error.message;
      if( errorCode === "auth/email-already-in-use"){
        alert('이미 존재하는 사용자입니다. 로그인 해주세요.');
        history.push('/login')
      }
    });
  }

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      const uid = (firebaseApp.auth().currentUser || {}).uid
      if(uid){
        setLoginStatus(true);
        setUid(uid);
        history.push('/app')
      }else{
      }
    })
  }, [])

  return (
    <div>     
      <Spinner show={loading}/> 
      <div className="flex aic jcc vh100">
        <div className="w400">
          <div className="fdr aic pt16">
            <div className="w100">
              <span>NickName</span>
            </div>
            <input onChange={evt => {setNickName(evt.target.value)}}
              className="default_input f1"
              placeholder="nickname"
              value={nickName}
            />
          </div>

          <div className="fdr aic pt16">
            <div className="w100">
              <span>email</span>
            </div>
            <input onChange={evt => {setEmail(evt.target.value)}}
              className="default_input f1"
              placeholder="email"
              value={email}
            />
          </div>
          <div className="fdr aic pt16">
            <div className="w100">
              <span>password</span>
            </div>
            <input onChange={evt => {setPassword(evt.target.value)}}
              className="default_input f1"
              placeholder="password"
              type="password"
              value={password}
            />
          </div>
          <div className="jcc flex pt16 pb16">
          </div>
          <Button type="button" variant="outlined" color="primary" onClick={signup}> Sign Up </Button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
