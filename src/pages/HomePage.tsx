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
import { useCallback, useEffect, useState } from "react";
import TableToolbar from "../components/table/TableToolbar";
import { useSnackbar } from "notistack";
import { functions } from "../config/firebase";
import firebase from "firebase/app";
import { createSelector } from "reselect";
import UserRow from "../components/table/UserRow";
import EmptyRow from "../components/table/EmptyRow";
import LoadingRow from "../components/table/LoadingRow";

const emailUsers = createSelector(
  (state: { users: firebase.User[] }) => state.users,
  (users) => users.filter((user) => user.email)
);

const filterdEmailUsers = createSelector(
  [emailUsers, (state: { text: string | undefined }) => state.text],
  (users, text) => {
    console.log(text);
    return users.filter((user) =>
      text
        ? user.displayName?.toLocaleLowerCase().includes(text.toLowerCase()) ||
          user.email?.toLocaleLowerCase().includes(text.toLowerCase())
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
  })
);
const HomePage = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<firebase.User[]>([]);
  const [text, setText] = useState<string>();

  const loadUsers = useCallback(() => {
    setLoading(true);
    functions
      .httpsCallable("listUsers")()
      .then((res) => {
        if (Array.isArray(res.data?.users)) setUsers(res.data.users);
        setLoading(false);
      })
      .catch(() => {
        enqueueSnackbar("Không thể tải danh sách người dùng", {
          variant: "error",
        });
        setLoading(false);
      });
  }, [enqueueSnackbar]);

  const handleChange = (user: any) => {
    setUsers((users) => users.map((u) => (user.uid === u.uid ? user : u)));
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar
          onRefresh={() => {
            loadUsers();
          }}
          onSearchChange={(value) => {
            setText(value);
          }}
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
                <TableCell width={200}>Xác thực Email</TableCell>
                <TableCell width={600}>
                  Thời gian đăng ký và đăng nhập
                </TableCell>
                <TableCell width={100}></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterdEmailUsers({ users, text }).map((row) => (
                <UserRow
                  key={row.uid}
                  item={row}
                  onChange={(user) => handleChange(user)}
                />
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (loading ? <LoadingRow /> : <EmptyRow />)}
        </TableContainer>
      </Paper>
    </div>
  );
};

export default HomePage;
