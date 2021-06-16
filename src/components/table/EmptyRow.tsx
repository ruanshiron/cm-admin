import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(3),
      textAlign: "center",
    },
  })
);

export default function EmptyRow() {
  const classes = useStyles();
  return (
    <div>
      <Typography className={classes.margin}>Không có dữ liệu</Typography>
    </div>
  );
}
