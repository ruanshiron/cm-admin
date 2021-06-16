import {
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  Chip,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  Button,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { functions } from "../../config/firebase";

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

interface Props {
  item: any;
  onChange: (disabled: boolean) => void;
}

const UserRow: React.FC<Props> = ({ item, onChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState<string>();
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }, [newEmail]);

  const handleClickOpenDialog = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setNewEmail(undefined);
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleDisabled = () => {
    functions
      .httpsCallable("updateUser")({ uid: item.uid, disabled: !item.disabled })
      .then(() => {
        enqueueSnackbar(
          !item.disabled
            ? "Người dùng đã bị khóa tài khoản"
            : "Người dùng đã được mở khóa tài khoản",
          {
            variant: "success",
          }
        );
        onChange({ ...item, disabled: !item.disabled });
      })
      .catch((err) => {
        enqueueSnackbar("Lỗi! Không thể khóa tài khoản này", {
          variant: "error",
        });
      });
    setAnchorEl(null);
  };

  const handleChangeEmail = () => {
    functions
      .httpsCallable("updateUser")({ uid: item.uid, email: newEmail })
      .then(() => {
        enqueueSnackbar(`Người dùng đã dược thay đổi email thành ${newEmail}`, {
          variant: "success",
        });
        onChange({ ...item, email: newEmail });
      })
      .catch(() => {
        enqueueSnackbar("Lỗi! Không thể thay đổi email tài khoản này", {
          variant: "error",
        });
      });
    setNewEmail(undefined);
    setOpen(false);
  };

  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        <Typography>{item.displayName}</Typography>
        <Typography variant="subtitle2">{item.email}</Typography>
      </TableCell>
      <TableCell align="center">{item.emailVerified ? "✔️" : ""}</TableCell>
      <TableCell>
        <Typography>
          {item.metadata.creationTime &&
            new Intl.DateTimeFormat("vi-VN", {
              dateStyle: "full",
              timeStyle: "long",
            }).format(new Date(item.metadata.creationTime))}
        </Typography>
        <Typography>
          {item.metadata.creationTime &&
            new Intl.DateTimeFormat("vi-VN", {
              dateStyle: "full",
              timeStyle: "long",
            }).format(new Date(item.metadata.lastSignInTime))}
        </Typography>
      </TableCell>
      <TableCell>
        {item.disabled && <Chip label="Bị khóa" size="small" />}
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Xóa" aria-label="delete">
          <IconButton
            aria-label="delete"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleToggleDisabled}>
            {item.disabled ? "Mở khóa" : "Khóa"}
          </MenuItem>
          <MenuItem onClick={handleClickOpenDialog}>Đổi Email</MenuItem>
        </Menu>
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Đổi email người dùng</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Email hiện tại của người dùng là <b>{item.email}</b>, nhập email
              mới vào trường bên dưới và xác nhận để đổi.
            </DialogContentText>
            <TextField
              error={emailError}
              autoFocus
              margin="dense"
              id="name"
              label="Email mới"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleChangeEmail} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
