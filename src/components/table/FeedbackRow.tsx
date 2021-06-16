import {
  TableRow,
  TableCell,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

interface Props {
  item: any;
  onDelete: (item: any) => void;
}

const FeedbackRow: React.FC<Props> = ({ item, onDelete }) => {
  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        <Typography>{item?.authorName}</Typography>
        <Typography variant="subtitle2">{item?.authorEmail}</Typography>
      </TableCell>
      <TableCell>{item?.created?.toDate().toLocaleDateString()}</TableCell>
      <TableCell>{item.content}</TableCell>
      <TableCell align="right">
        <Tooltip title="Xóa" aria-label="delete">
          <IconButton aria-label="delete" onClick={() => onDelete(item)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default FeedbackRow;
