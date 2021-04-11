import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { db, firebaseApp } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import { BiLogOut } from "react-icons/bi";
import { Grid, Paper, Button, TextField, List, ListItem, ListItemText, Typography, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  listDiv: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    display: "block",
    maxHeight:500, 
    overflow: 'auto',
  },
  input: {
    width: "450px",
    height: "55px",
    marginRight: theme.spacing(2),
  },
  btn: {
    height: "55px"
  },
  paper: {
    width: 700,
    padding: theme.spacing(2),
  },
  paperTop: {
    width: 700,
    padding: theme.spacing(2),
  }
}));

const ChatRoomCreate = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [channel, setChannel] = useState("");
  const [roomData, setRoomData] = useState([]);

  const onTextareaChange = (evt) => {
    setChannel(evt.target.value);
  };

  const creatNewChatRoom = () => {
    if(Object.values(roomData).indexOf(channel) > -1){
      alert('이미 존재하는 채널명입니다.');
      setChannel('');
      return;
    }

    db
    .collection('chat')
    .doc('room_' + channel)
    .set({name: channel})
    .then(() => {
      alert(channel + ' 채널이 생성되었습니다.');
      history.push(`/chat/${channel}`);
    })
    .catch(() => {
      alert('채널 생성에 실패하였습니다.');
    });
  };

  const joinChat = (roomName) => {
    history.push(`/chat/${roomName}`);
  }

  const logout = () => {
    firebaseApp.auth().signOut();
    history.push("/login");
  };

  useEffect(() => {
    let addedList = [];
    db.collection("chat")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        addedList = addedList.concat({id:doc.id, name:doc.data().name});
      });
      setRoomData(addedList);
    })
  }, []);

  return (
    <div>
      <Grid container direction="column" alignItems="flex-end" spacing={10}>
        <Grid item xs={12} sm={12} md={12}>
          <div
            className="flex fdr aic cursor_pointer"
            onClick={(evt) => {
              logout();
            }}
          >
            <BiLogOut />
            <span>Logout</span>
          </div>
        </Grid>
      </Grid>
      <Grid container direction="column" alignItems="center">
        <Grid item item xs={12} sm={12} md={12}>
          <Paper className={classes.paperTop} elevation={3}>
          <Typography variant="h6"> Create Channel </Typography>
          <TextField
            className={classes.input}
            variant="outlined"
            placeholder="개설할 채널 이름을 입력하세요."
            value={channel}
            onChange={(evt) => {
              onTextareaChange(evt);
            }}
          />
          <Button
            className={classes.btn}
            type="button"
            variant="contained"
            onClick={(evt) => creatNewChatRoom()}
          >
            Create Channel
          </Button>
          </Paper>
        </Grid>

        <Typography variant="h6"> or </Typography>

        <Grid item item xs={12} sm={12} md={12}>
          <Paper className={classes.paper} elevation={3}>
            <Typography variant="h6"> Join Channel </Typography>
            <div className={classes.listDiv}>
              <List>
                { roomData && 
                  roomData.map((room) => {
                    return <ListItem key={room.id} button onClick={(evt) => joinChat(room.name)}> <ListItemText primary={room.name} /></ListItem>
                  })
                }
                { roomData == null || roomData.length == 0 && ( <Typography>현재 개설된 채팅방이 없습니다.</Typography>)}
              </List>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatRoomCreate;
