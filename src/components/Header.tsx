import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuBookTwoToneIcon from "@material-ui/icons/MenuBookTwoTone";
import { Route, Switch, useHistory } from "react-router-dom";
import { auth } from "../config/firebase";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  fixedButton: {
    width: 100,
  },
}));

export default function Header() {
  const history = useHistory();

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (to?: string) => {
    setAnchorEl(null);
    if (to) history.push(to);
  };
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Button
          className={classes.fixedButton}
          size="small"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <Switch>
            <Route exact path="/">
              Người dùng
            </Route>
            <Route exact path="/feedback">
              phản hồi
            </Route>
          </Switch>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
          <MenuItem onClick={() => handleClose("/")}>
            Danh sách người dùng
          </MenuItem>
          <MenuItem onClick={() => handleClose("/feedback")}>
            Danh sách phản hồi
          </MenuItem>
        </Menu>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="center"
          noWrap
          className={classes.toolbarTitle}
        >
          <MenuBookTwoToneIcon fontSize="large" />
        </Typography>
        <Button variant="outlined" size="small" onClick={handleSignOut}>
          Đăng xuất
        </Button>
      </Toolbar>
    </React.Fragment>
  );
}
