import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const useStyles = makeStyles((theme) => ({
  footer: {
    // marginTop: theme.spacing(8),
    padding: theme.spacing(6, 0),
  },
}));

export default function Footer() {
  const classes = useStyles();

  const [user] = useAuthState(auth);

  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          {user?.email}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {"💼 Quản trị viên "}
          <Link color="inherit" href="https://cm-client.vercel.app/">
            CM
          </Link>
        </Typography>
      </Container>
    </footer>
  );
}
