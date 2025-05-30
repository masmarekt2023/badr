import React from 'react'
import {
  Typography,
  Box,

} from '@mui/material'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  token: {
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: "20px",
    '& p': {
      fontSize: '14px',
      fontWeight: '500',
      lineHight: '20px',
      color: '#000',
    },
    '& img': {
      marginTop: '5px',
      borderRadius:"50%"
    },
  },
}))

export default function BalanceBadge({ token, balance }) {
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.token}>
        <Box>
          <Typography variant="h6" component="h6">
            {balance?.toFixed(2)}
          </Typography>
          <Typography variant="h6" component="h6">
            {token.name}
          </Typography>
          <img height="25" width="25" src={'/' + token.img} />
        </Box>
      </Box>
    </Box>
  )
}
