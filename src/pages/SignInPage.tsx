import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { auth } from "../config/firebase";
import { useState } from "react";
import { purple } from "@material-ui/core/colors";
import { useSnackbar } from "notistack";

function Note() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"( ˙꒳​˙ )	nếu không phải quản trị viên, qua "}
      <Link color="inherit" href="https://cm-client.vercel.app">
        đây
      </Link>
      {"."}
    </Typography>
  );
}

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  progress: {
    color: purple[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
}));

export default function SignInPage() {
  const classes = useStyles();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = () => {
    if (email && password) {
      setLoading(true);
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => setLoading(false))
        .catch((err) => {
          enqueueSnackbar("Thông tin đăng nhập không chính xác", {
            variant: "error",
          });
          setLoading(false);
        });
    } else {
      enqueueSnackbar("Điền đầy đủ thông tin đăng nhập", {
        variant: "error",
      });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.wrapper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          {loading && (
            <CircularProgress size={68} className={classes.progress} />
          )}
        </div>
        <Typography component="h1" variant="h5"></Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          disabled={loading}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </div>
      <Box mt={8}>
        <Note />
      </Box>
    </Container>
  );
}
