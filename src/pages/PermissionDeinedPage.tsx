import {
  Typography,
  Button,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core";
import { auth } from "../config/firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: 40,
    },
  })
);

export default function PermissionDeinedPage() {
  const classes = useStyles();
  const handleSignOut = () => {
    auth.signOut();
  };
  return (
    <div className="center-content">
      <Typography variant="h1" component="h2">
        403
      </Typography>
      <Typography>
        Bạn không phải quản trị viên, vui lòng đăng xuất 😅
      </Typography>
      <Button
        className={classes.margin}
        variant="outlined"
        color="secondary"
        onClick={handleSignOut}
      >
        Đăng xuất
      </Button>
    </div>
  );
}
