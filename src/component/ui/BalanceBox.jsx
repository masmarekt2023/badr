import React from 'react'
import {
  List,
  ListItem,
  Paper,
  
} from '@mui/material'
import { makeStyles } from '@mui/styles';

import BalanceBadge from "src/component/BalanceBadge";

const useStyles = makeStyles(() => ({
  masBox: {
    background: "#cdc8c8 !important",
    borderRadius: "13px",
    padding: "0px",
    "& ul": {
      display: "flex",
      padding: "0",
      justifyContent: "center",
      "& li": {
        display: "flex",
        justifyContent: "center",
        position: "relative",
        "&::after": {
          content: " ''",
          position: "absolute",
          height: "70%",
          width: "1px",
          backgroundColor: "#e5e3dd",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
        },
        "&:last-child::after": {
          display: "none",
        },
      },
    },
  },
}))

export default function BalanceBox({ availableBalance, tokensDetails, setSelectedToken }) {
  const classes = useStyles();

  return (
    <Paper className={classes.masBox}>
      <List>
        {tokensDetails.map((d, i) => {
          return (
            <ListItem p={0}
              style={{ cursor: "pointer", borderRadius: "20px" }}
              onClick={() => { setSelectedToken(d) }}
              key={i}>
              <BalanceBadge
                token={d}
                balance={availableBalance[d.databaseKey]}
              />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  )
}
