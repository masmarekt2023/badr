import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Container,
  Pagination,  // Corrected import
  TextField, // Add TextField import
  InputAdornment, // For search icon
  IconButton
} from '@mui/material';  // Make sure all material components are imported from MUI v5
import SearchIcon from '@mui/icons-material/Search'; // Import search icon
import { makeStyles } from '@mui/styles';
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import DataLoading from "src/component/DataLoading";
import UserDetailsCard from "src/component/UserCard";
import NoDataFound from "src/component/NoDataFound";  // Custom component
import { ButtonwithAnimation } from "../../../component/ui/Button/button";
import CardCreators from "../../../component/ui/Card/CardCreators";
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { FaSearch } from "react-icons/fa";
import "src/views/pages/About/AboutUs.css"
import { transform } from "lodash";


const useStyles = makeStyles(() => ({

  container: {
    padding: "20px 0px",


  },
 
  divider: {
    // padding: "20px 10px",
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  heading: {
    textAlign: "center",
    // padding: '33px'
  },
  userGridContainer:{
      justifyContent: 'center',
   

  },
  gridbox: {
    justifyContent: 'center',
    paddingleft: "0",

    
    // "@media(max-width:1280px)": {
    //   display: "flex",
    //   justifyContent: "center",
    //   transition: 'border 0.3s ease',
    // },

  },
}));

export default function Login(chat,subscrib,Subscribe,CardpersonalInfo
) {
  const classes = useStyles();
  const [search, setsearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(1);
  const [userListToDisplay, setUserListToDisplay] = useState([]);
  const [openSeachBar , SetOpenSearchBar] = useState(false)
      const {t} = useTranslation();

      const { ref: ref2,inView: inView2 } = useInView({
        threshold: 0.2, 
        triggerOnce: true,
      });
    
      const { ref: ref3,inView: inView3 } = useInView({
        threshold: 0.2, 
        triggerOnce: true, 
      }); 
  

  const getuser = async (cancelTokenSource) => {
    console.log("Starting API request...");
  console.log("Page:", page);
  console.log("Search:", search);
  console.log("Cancel Token:", cancelTokenSource && cancelTokenSource.token);
    axios({
      method: "GET",
      url: Apiconfigs.latestUserList,
      data: {
        cancelToken: cancelTokenSource && cancelTokenSource.token,
      },
      params: {
        limit: 10,
        page: page,
        search: search,
        userType: "Creator",
      },
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsLoading(false);
        console.log("API Response:", res);
        console.log("Status Code:", res.data.statusCode);
        console.log("Result Docs:", res.data.result.docs);
        console.log("Total Pages:", res.data.result.pages);
        if (res.data.statusCode === 200) {
          if (res.data.result.docs) {
            setNoOfPages(res.data.result.totalPages);
            setUserListToDisplay(res.data.result.docs);
          }
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();
    getuser(cancelTokenSource);

    return () => {
      cancelTokenSource.cancel();
    };
  }, [search, page]);

  const handleSearchChange = (event) => {
    setsearch(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <Box className={classes.container}
    sx={{
     
      background: (theme) => theme.custom.PageBackGround,
     
    }}
    >
       

    
      {isLoading ? (
       <Box padding='250px' display='flex' justifyContent='center' alignItems='center'>
              <DataLoading />
              </Box>
      ) : (
        <Container maxWidth="xl">
  

          <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            
           
          }}
          className="bunner-animaton">

            <div style={{ position: 'relative', display: 'inline-block' }}>
      <img 
        src="/assets/Images/wave10.png" 
        alt="Description" 
        style={{ display: 'block', transform:" scale(0.7)" }}
      />
      <div style={{
         position: 'absolute',
         top: '50%',
         left: '50%',
         transform: 'translate(-50%, -50%)',
         color: 'white',
         fontSize: '2.5rem',
          fontWeight:"bold",
         textShadow:"0px 0px 10px white"
       
      }}>
       Mas Creators
      </div>
    </div>
    </div>


                      <div className="who-we-are-sec">
      <div className={`who-top-sec ${inView2 ? 'animate' : ''}`} ref={ref2}>
      <span className="who-text1">Here Are The Most Passionate and Ambitious Creators</span>
      <span className="who-text2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl,</span>
        </div>
        
        <div className={`who-bottom-sec ${inView3 ? 'animate' : ''}`} ref={ref3} >
          <img style={{
            display:"inline",
            width:"100%",
            borderRadius:"20px"
          }} 
          src="/assets/Images/creator3.jpg" alt="" />
        </div>
      </div>

      
      <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems:"center",
            marginBottom: '10px', 
            position:"fixed",
            bottom:"70px",
            right:"15px",
            zIndex:"100",
            gap:"5px"
          }}>
            {openSeachBar && <TextField
              fullWidth
              variant="outlined"
              placeholder="Search creators by name..."
              value={search}
              onChange={handleSearchChange}
              sx={{
                maxWidth: '300px',
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.24)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#2d013a' }} />
                  </InputAdornment>
                ),
              }}
            />}
            <IconButton
            onClick={() => SetOpenSearchBar(!openSeachBar)}
            sx={{
              "&:hover":{
                transform:"scale(1.2)",
                transition:"ease-out 1s"
              }
            }}
            >
            <FaSearch   style={{fontSize:"40px"
            ,  color:"#cdc8c8",
              cursor:"pointer",
             
            }}/>
            </IconButton>
           
           
          </Box>
     
                      
          {userListToDisplay.length === 0 ? (
            <Box align="center" mt={4} mb={5}>
              <NoDataFound />
            </Box>
          ) : (
            ""
          )}
          <Grid 
           container
           
          
          className={classes.userGridContainer}>
            
        
            {userListToDisplay.map((data, i) => {
              return (
                
                <Grid  
                container
                item
                key={i}
                xs={12}
                sm={4}
                md={3}
              lg={2.2}
                className={classes.gridbox}
                mb={2}
                


               >
<CardCreators  data={data}
                                chat={chat}
                                subscrib={subscrib}
                                CardpersonalInfo={CardpersonalInfo}
                                Subscribe={Subscribe}
/>
                </Grid>
                
                
              );
            })}
          </Grid>
        </Container>
      )}
      <Box display="flex" justifyContent="center" dir="ltr">
        {noOfPages > 1 && (
          <Pagination
            count={noOfPages}
            page={page}
            onChange={(e, v) => setPage(v)}
            sx={{
              "& .MuiPaginationItem-root": { color: "white" }, // Change text color
              "& .MuiPaginationItem-page.Mui-selected": {  color: "grey" }, // Change selected color
              "& .MuiPaginationItem-ellipsis": { color: "white" }, // Change ellipsis color
            }}
          />
        )}
      </Box>
    </Box>
  );
}
