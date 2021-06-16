import {
  makeStyles,
  createStyles,
  Theme,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Refresh as RefreshIcon } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    search: {
      flex: "1 1 100%",
    },
  })
);

interface Props {
  onRefresh: ReturnType<any>;
  onSearchChange: (text: string) => void;
}

const TableToolbar: React.FC<Props> = ({ onRefresh, onSearchChange }) => {
  const classes = useToolbarStyles();
  const [text, setText] = useState<string>();
  const handleRefresh = () => {
    onRefresh();
    setText(undefined);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    onSearchChange(event.target.value.toString());
  };

  return (
    <Toolbar className={classes.root}>
      <TextField
        className={classes.search}
        id="input-with-icon-textfield"
        variant="outlined"
        size="small"
        placeholder="Tìm kiếm"
        value={text}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <IconButton onClick={handleRefresh}>
        <RefreshIcon />
      </IconButton>
    </Toolbar>
  );
};

export default TableToolbar;
