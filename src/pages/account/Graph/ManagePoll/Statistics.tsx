import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function Statistics() {
  // connect to the statistics part of the real time database

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
            <TableCell>567</TableCell>
            <TableCell>{Math.round((56700 / 723) * 100) / 100}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Disapprovers</TableCell>
            <TableCell>67</TableCell>
            <TableCell>{Math.round((6700 / 723) * 100) / 100}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Abstained</TableCell>
            <TableCell>89</TableCell>
            <TableCell>{Math.round((8900 / 723) * 100) / 100}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Participants</TableCell>
            <TableCell>723</TableCell>
            <TableCell>100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
