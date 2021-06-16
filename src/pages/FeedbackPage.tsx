import {
  makeStyles,
  createStyles,
  Theme,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  TableBody,
  Tooltip,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { database } from "../config/firebase";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import EmptyRow from "../components/table/EmptyRow";
import TableToolbar from "../components/table/TableToolbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      paddingTop: 40,
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
  })
);

const FeedbackPage = () => {
  const classes = useStyles();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const [feedback, setFeedback] = useState<any[]>([]);

  const loadFeedback = useCallback(() => {
    database
      .collection("feedback")
      .get()
      .then((snap) => {
        const fb = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeedback(fb);
      });
  }, []);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleDeleteItem = (item: { id: string }) => {
    confirm({
      title: "Bạn có chắn chắn?",
      description: "Phản hổi này sẽ bị xóa.",
      cancellationText: "Hủy",
      confirmationText: "Xóa",
    })
      .then(() => {
        database
          .collection("feedback")
          .doc(item.id)
          .delete()
          .then(() => {
            enqueueSnackbar(`Phản hồi [${item.id}] đã được xóa`, {
              variant: "success",
            });
            setFeedback((fb) => fb.filter((value) => value.id !== item.id));
          })
          .catch(() => {
            enqueueSnackbar(`Lỗi! không thể xóa phản hồi [${item.id}]`, {
              variant: "error",
            });
          });
      })
      .catch(() => {
        /* ... */
      });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar
          onRefresh={() => {
            loadFeedback();
          }}
          onSearchChange={() => {}}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell width={100}>Người dùng</TableCell>
                <TableCell width={50}>Thời gian</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedback.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    <Typography>{row?.authorName}</Typography>
                    <Typography variant="subtitle2">
                      {row?.authorEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {row?.created?.toDate().toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.content}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Xóa" aria-label="delete">
                      <IconButton
                        aria-label="delete"
                        className={classes.margin}
                        onClick={() => handleDeleteItem(row)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {feedback.length === 0 && <EmptyRow />}
        </TableContainer>
      </Paper>
    </div>
  );
};

export default FeedbackPage;
