import React, { useState, useEffect } from "react";
import "../login.css";
import { useHistory } from "react-router-dom";
import { firebaseApp } from "../firebase";
import Spinner from "../components/Spinner";
import {Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Container} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  btn: {
    margin: theme.spacing(0, 0, 2),
    color: '#ffffff'
  }
  // loginBtn: {
  //   margin: theme.spacing(0, 0, 2),
  //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  //   borderRadius: 3,
  //   border: 0,
  //   color: 'white',
  //   height: 48,
  //   padding: '0 30px',
  //   boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  // },
  // signUpBtn: {
  //   margin: theme.spacing(0, 0, 2),
  //   background: '#ffffff',
  //   borderRadius: 3,
  //   borderColor:'rgba(255, 105, 135, .3)',
  //   border: '2px solid rgba(255, 105, 135, .3)',
  //   color: 'white',
  //   height: 48,
  //   padding: '0 30px',
  // },
}));

const Login = () => {
  const classes = useStyles();

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [initLoaded, setInitLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);

  const [loginFlag, setLoginFlag] = useState(true);
  const [signupFlag, setSignupFlag] = useState(false);

  const switchers = [...document.querySelectorAll('.switcher')]

  switchers.forEach(item => {
    item.addEventListener('click', function() {
      switchers.forEach(item => item.parentElement.classList.remove('is-active'))
      this.parentElement.classList.add('is-active')
    })
  })

  const onClickSwitcherLogin = () => {
    setSignupFlag(false);
    setLoginFlag(true);
  }

  const onClickSwitcherSignup = () => {
    setLoginFlag(false);
    setSignupFlag(true);
  }


  const login = () => {
    if (email.length < 3) {
      alert("Please check your email");
      return;
    }
    //you might want to apply regex here.

    setLoading(true);

    firebaseApp
      .auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        const uid = (firebaseApp.auth().currentUser || {}).uid;
        if (uid) {
          setLoginStatus(true);
          setEmail("");
          setPassword("");
          history.push("/createChat");
          setLoading(false);
        } else {
          alert("error");
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        
        let errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
          alert("가입하세요.");
        }else if(errorCode === "auth/invalid-email"){
          alert("이메일 형식이 아닙니다.");
        }else if (errorCode === "auth/wrong-password") {
          alert("비밀번호가 올바르지 않습니다.");
        }else if (errorCode === "auth/too-many-requests") {
          alert("다시 로그인 해주세요.");
          window.location.reload();
        }else{
          console.log(error);
        }
      });
  };

  const logout = () => {
    firebaseApp.auth().signOut();
    setLoginStatus(false);
  };

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      setInitLoaded(true);
      
      const uid = (firebaseApp.auth().currentUser || {}).uid;
      if (uid) {
        setLoginStatus(true);
        history.push("/createChat");
      } else {
        //TODO: else 작성
      }
    });
  }, []);

  const goToSignup = () => {
    history.push("/signup");
  };

  if (!initLoaded) {
    return <></>;
  }

  return (
    <div>
      {/* <Spinner show={loading} /> */}
      {loginStatus ? (
        <>
          <div className="btn btn-danger" onClick={(evt) => {logout();}}> logout </div>
        </>
      ) : (
        <>
        <section class="forms-section">
          <h1 class="section-title">Let's Chat!</h1>
          <div class="forms">
            <div class={loginFlag? "form-wrapper is-active" : "form-wrapper"} >
                  <button type="button" class="switcher switcher-login" onClick={onClickSwitcherLogin}>
                    Login
                    <span class="underline"></span>
                  </button>
                  <form class="form form-login">
                        <fieldset>
                          <legend>Please, enter your email and password for login.</legend>
                          <div class="input-block">
                            <label for="login-email">E-mail</label>
                            <input id="login-email" type="email" required />
                          </div>
                          <div class="input-block">
                            <label for="login-password">Password</label>
                            <input id="login-password" type="password" required />
                          </div>
                        </fieldset>
                        <button type="submit" class="btn-login">Login</button>
                  </form>
            </div>
            <div class={signupFlag? "form-wrapper is-active" : "form-wrapper"}>
              <button type="button" class="switcher switcher-signup" onClick={onClickSwitcherSignup}>
                Sign Up
                <span class="underline"></span>
              </button>
              <form class="form form-signup">
                <fieldset>
                  <legend>Please, enter your email, password and password confirmation for sign up.</legend>
                  <div class="input-block">
                    <label for="signup-email">E-mail</label>
                    <input id="signup-email" type="email" required />
                  </div>
                  <div class="input-block">
                    <label for="signup-password">Password</label>
                    <input id="signup-password" type="password" required />
                  </div>
                  <div class="input-block">
                    <label for="signup-password-confirm">Confirm password</label>
                    <input id="signup-password-confirm" type="password" required />
                  </div>
                </fieldset>
                <button type="submit" class="btn-signup">Continue</button>
              </form>
            </div>
          </div>
        </section>


          {/* <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={evt => {setEmail(evt.target.value)}}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={evt => {setPassword(evt.target.value)}}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.btn}
                  onClick={evt => {login()}}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined" 
                  color="primary"
                  className={classes.btn}
                  onClick={goToSignup}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
            <Box mt={8}>
            </Box>
          </Container> */}
        </>
      )}
    </div>
  );
};

export default Login;
