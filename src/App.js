import React, {useState,useEffect} from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
} from '@mui/material';
import './App.css';

function App() {
  const token = process.env.REACT_APP_TOKEN;
  const apiUrl = process.env.API_URL

  const [player,setPlayer] =  useState([]);
  const [loading,setLoading] = useState()
  const [error,setError] = useState(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);

  const fetchPlayers = async (page, limit) => {
    try {
      const response = await axios.get(`http://62.72.27.76:3000/admin/players?skip=${page * limit}&limit=${limit}`,{
        headers: {
          'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQHNodWJoLmNvbSIsInN1YiI6IjY2ZTQwNmY3MWVjNTFkMjczNTgwYmVkNCIsImlhdCI6MTcyNzY4ODg0NiwiZXhwIjoxNzI4MzEwMDQ2fQ.j1ZNyLJM1ehbdMaThM7bPNq5JRJLaT41UgIzANMhB4M'
        }
      });
      setPlayer(response.data.items);
      setTotalPlayers(response.data.metadata.totalCount);
      setLoading(false)

    } catch (error) {
      console.error('Error fetching players:', error);
      setError("Error Fetching data")
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchPlayers(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if(loading){
    return <div>
      Loading.....
    </div>
  }

  if(error){
    return <div>
      {error}
    </div>;
  }

  return (
    <Paper>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell> Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Store</TableCell>
            <TableCell>Owner Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {player.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.owner.name}{' '}{player.owner.surname}</TableCell>
              <TableCell>{player.owner.email}</TableCell>
              <TableCell>{player.store.name}</TableCell>
              <TableCell>{player.store.owner.name}{' '}{player.store.owner.surname}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[1, 5, 10]}
      component="div"
      count={totalPlayers}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
  );
}

export default App;