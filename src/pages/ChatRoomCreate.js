import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { db, firebaseApp } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import { BiSend, BiLogOut, BiCommentAdd } from "react-icons/bi";
import {
  Grid,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@material-ui/core";

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
    history.push(`/chat/${channel}`);
  };

  const logout = () => {
    firebaseApp.auth().signOut();
    history.push("/login");
  };

  // const roomRef = db.collection("chat");
  // roomRef.onSnapshot((snapshot) => {
  //   console.log("snapshot.size => ", snapshot.size);
  //   snapshot.docs.map((doc) => {
  //     console.log("doc.data => ", doc.data().name); 
  //     console.log("doc.getId => ", doc.id);
  //   });
  // });

  // useEffect(() => {
  //   db.collection("chat")
  //   .get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       console.log("querySnapshot.size => ", querySnapshot.size);
  //       console.log("doc.data().name  => ", doc.data().name);
  //       roomData.push(doc.data().name);
  //       //setRoomDate({...roomData, ['name']:doc.data().name});
  //       console.log(roomData);
  //     });
  //   });
  // },[roomData]);
 

  useEffect(() => {
    db.collection("chat")
    .get()
    .then((querySnapshot) => {
      let addedList = [];
      querySnapshot.forEach((doc) => {
        addedList = addedList.concat({id:doc.id, name:doc.data().name});
        console.log('addedList---------->', addedList);
      });
        if(addedList){
          setRoomData(addedList);
          console.log('roomData--------->', roomData);
        }
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
          <Typography variant="h6"> Create Chat Room </Typography>
          <TextField
            className={classes.input}
            variant="outlined"
            placeholder="채널 이름을 입력하세요."
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
            <Typography variant="h6"> Join Chat </Typography>
            <div className={classes.listDiv}>
                { roomData && 
                  roomData.map((room) => {
                    <Typography>{room.id + room.name}</Typography>
                    // <ListItem button> <ListItemText primary={room.id} /> </ListItem>
                  })
                }
                {
                  roomData == undefined || roomData.length == 0 && (
                    <Typography>현재 개설된 채팅방이 없습니다.</Typography>
                  )
                }
              {/* <List>
                  <ListItem button> <ListItemText primary="test" /> </ListItem>
              </List> */}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatRoomCreate;
