import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function OnInputChange(event) {
    console.log(event.target.value);
}

export default function SearchBar() {
  return (
    <div class="container myclass">
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        <InputBase
          style={{ padding: '0 20px'}}
          sx={{ ml: 1, flex: 1 }}
          maxWidth="80%"
          placeholder="Search for Notes"
          inputProps={{ 'aria-label': `search for Notes` }}
          onChange={OnInputChange}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
}
