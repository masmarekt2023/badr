import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        padding: theme.spacing(3),
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 2000,
        backgroundColor:"#fff",
    },
    loader:{
        width:300,
        maxWidth:"100%",
        margin: "auto",
    },
    progressBar:{
height:"3px",
    },
}));

export default function PageLoading() {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Box width={300} display='flex' alignItems='center' justifyContent='center'>
                {/* <LinearProgress height={10} /> */}
                <img className={classes.loader} src="/images/iloader.gif" alt="loader" />
            </Box>
        </div>
    )
}
