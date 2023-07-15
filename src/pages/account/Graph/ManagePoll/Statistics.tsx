import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

interface IStatistics {
  approvers?: number;
  disapprovers?: number;
  abstained?: number;
}
export default function Statistics({
  approvers = 0,
  disapprovers = 0,
  abstained = 0,
}: IStatistics) {
  const total = approvers + disapprovers + abstained;
  const divisor = total || 1;
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Statistics</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Approvers</TableCell>
            <TableCell>{approvers}</TableCell>
            <TableCell>
              {Math.round(((approvers * 10) / divisor) * 100) / 10}%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Disapprovers</TableCell>
            <TableCell>{disapprovers}</TableCell>
            <TableCell>
              {Math.round(((disapprovers * 10) / divisor) * 100) / 10}%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Abstained</TableCell>
            <TableCell>{abstained}</TableCell>
            <TableCell>
              {Math.round(((abstained * 10) / divisor) * 100) / 10}%
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Participants</TableCell>
            <TableCell>{total}</TableCell>
            <TableCell>100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
