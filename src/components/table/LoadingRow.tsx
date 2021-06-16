import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(3),
      textAlign: "center",
    },
  })
);

export default function LoadingRow() {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.margin}>Đang tải...</Typography>
    </div>
  );
}
