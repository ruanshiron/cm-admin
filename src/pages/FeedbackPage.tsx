import {
  makeStyles,
  createStyles,
  Theme,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { database } from "../config/firebase";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import EmptyRow from "../components/table/EmptyRow";
import LoadingRow from "../components/table/LoadingRow";
import TableToolbar from "../components/table/TableToolbar";
import FeedbackRow from "../components/table/FeedbackRow";
import { createSelector } from "reselect";

const filterdFeedback = createSelector(
  [
    (state: { feedback: any[] }) => state.feedback,
    (state: { text: string | undefined }) => state.text,
  ],
  (feedback, text) => {
    console.log(text);
    return feedback.filter((fb) =>
      text
        ? fb.content?.toLocaleLowerCase().includes(text.toLowerCase()) ||
          fb.authorName?.toLocaleLowerCase().includes(text.toLowerCase()) ||
          fb.authorEmail?.toLocaleLowerCase().includes(text.toLowerCase())
        : true
    );
  }
);

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
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [text, setText] = useState<string>();

  const loadFeedback = useCallback(() => {
    setLoading(true);
    database
      .collection("feedback")
      .get()
      .then((snap) => {
        const fb = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeedback(fb);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar(`Lỗi! Không tải được danh sách phản hổi`, {
          variant: "error",
        });
        setLoading(false);
      });
  }, [enqueueSnackbar]);

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
          onRefresh={() => loadFeedback()}
          onSearchChange={(value) => setText(value)}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
                <TableCell width={300}>Người dùng</TableCell>
                <TableCell width={200}>Thời gian</TableCell>
                <TableCell>Nội dung</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterdFeedback({ feedback, text }).map((row, index) => (
                <FeedbackRow
                  key={index}
                  onDelete={handleDeleteItem}
                  item={row}
                />
              ))}
            </TableBody>
          </Table>
          {feedback.length === 0 && (loading ? <LoadingRow /> : <EmptyRow />)}
        </TableContainer>
      </Paper>
    </div>
  );
};

export default FeedbackPage;
