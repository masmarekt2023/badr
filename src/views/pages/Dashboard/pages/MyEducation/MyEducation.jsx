import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormHelperText,
  InputAdornment,
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
} from '@mui/material';  // Unified MUI import from @mui/material

import { makeStyles } from '@mui/styles'; // Still using makeStyles, although using styled API is more recommended in MUI v5
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Correct icon import
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Correct icon import
import { useTranslation } from 'react-i18next';

import { UserContext } from "src/context/User";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import ButtonCircularProgress from "src/component/ButtonCircularProgress";
import NoDataFound from "src/component/NoDataFound";
import { toast } from "react-toastify";
import { tokensDetails } from "src/constants";
import ReactPlayer from "react-player";
import AddCourseDialog from "../../../../../component/AddCourseDialog";
import ShareTheLessonDialog from "../../../../../component/shareTheLessonDialog";
import MainCard from '../../ui-component/cards/MainCard'
import Cardcourse from "../../../../../component/ui/Card/Cardcourse";
import { ButtonwithAnimation } from "../../../../../component/ui/Button/button";
import { useNavigate } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  input_fild: {
    backgroundColor: "#ffffff6e",

    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    // height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderRadius: "20px",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
      height: "34px",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
 
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderRadius:"20px",
    [theme.breakpoints.down("xs")]: {
      display: "block",
    },
  },

  dailogTitle: {
    textAlign: "Center",
    "& h2": {
      color: "#141518",
      fontSize: "23px",
    },
  },
  input_fild2: {
    width: "100%",
    "& input": {
      height: "45px",
    },
  },
  UploadBox: {
    border: "solid 0.5px #707070",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "110px",
  },
  input_fild22: {
    width: "100%",
    "& input": {
      height: "45px",
      border: 0,
    },
    "& .MuiInput-underline:before": {
      border: 0,
    },
  },
  dlflex: {
    "& div": {
      marginTop: "2rem",
      "& span": {
        border: "1px solid #e8e7e7",
        fontSize: "20px",
        padding: "7px",
        marginRight: "6px",
      },
    },
  },
  donation: {
    "& span": {
      fontSize: "12px",
      padding: "2px 5px",
      border: "1px solid #ccc",
      cursor: "pointer",
      "&.active": {
        backgroundColor: "#ccc",
      },
    },
  },
  MuiButton: {
    containedSizeLarge: {
      [theme.breakpoints.down("xs")]: {
        padding: "8px 15px !important",
      },
    },
  },
  dailogTitle: {
    textAlign: "Center",
    "& h2": {
      color: "#141518",
      fontSize: "23px",
    },
  },
  tokenList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "7px",
    border: "solid 0.5px #e5e3dd;",
    "&:hover": {
      backgroundColor: "rgba(209, 91, 91, 0.39)",
    },
    "&.active": {
      backgroundColor: "rgba(209, 91, 91, 0.39)",
    },
    "& h3": {
      color: "#141518",
      fontSize: "14px",
    },
  },
  bunbox: {
  
      display: "flex",
      justifyContent: "center",
    },
  
}));

export default function MyEducation() {
  const {t} = useTranslation();
    const navigate = useNavigate();
  
  const courseCache = useRef({});
  const [state, setState] = useState({
    OpenAuction: false,
    openShareTheLesson: false,
    courseList: [],
    page: 1,
    pages: 1,
  });
  const { OpenAuction, courseList, page, pages, openShareTheLesson } = state;
  const updateState = (data) =>
    setState((prevState) => ({ ...prevState, ...data }));

  const classes = useStyles();
      

  useEffect(() => {
    getCourseListHandler().catch(console.error);
  }, [page]);

  useEffect(() => {
      const handleRefreshList = () => {
       getCourseListHandler(); // Re-fetch fresh data
      };
    
      window.addEventListener('refreshCourseList', handleRefreshList);
      
      return () => {
        window.removeEventListener('refreshCourseList', handleRefreshList);
      };
    }, []);

  return (<>
        <Box sx={{display:"flex" ,justifyContent:"center",alignItems:"center"}} mb={2} mt={10}><ButtonwithAnimation>My Education</ButtonwithAnimation></Box>
    
    <Box className={classes.LoginBox} mb={0}>
      <Box className={classes.masBoxFlex}>
       
        
                  <Typography variant="h6" color="black"></Typography>
          
          <Box display="flex" mt={2}>
           <Button
            variant="contained"
            size="medium"
            color=""
            sx={{background:(theme) => theme.custom.mainButton,color:'white',marginRight:"10px",
              "&:hover":{
                background:(theme) => theme.custom.hoverMainButton
              }}}
            onClick={() => updateState({ OpenAuction: true })}
          >
            {t("add a Course")}
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="white"
            sx={{background:(theme) => theme.custom.mainButton,color:'white',marginRight:"10px",
              "&:hover":{
                background:(theme) => theme.custom.hoverMainButton
              }}}
            onClick={() => updateState({ openShareTheLesson: true })}
          >
            {t("add a lesson")}
          </Button>
         
          
        
        </Box>
      </Box>
      <Box>
        {!courseList[0] ? (
          <Box align="center" mt={2} mb={5}>
            <NoDataFound />
          </Box>
        ) : (
          ""
        )}

        <Grid container spacing={2} className={classes.bunbox}  >
          {courseList.map((data, i) => {
            return (
              <Grid item key={i} lg={3} md={5} sm={6} xm={12}>
                <Cardcourse data={data}/>
                {/* <CourseCard data={data} index={i} isDays={true} /> */}
              </Grid>
            );
          })}
        </Grid>
        {pages > 1 && (
          <Box
            mb={2}
            mt={2}
            display="flex"
            justifyContent="center"
            style={{ marginTop: 10 }}
          >
            <Pagination
              count={pages}
              page={page}
              onChange={(e, v) => updateState({ page: v })}
            />
          </Box>
        )}
      </Box>

      {/* add course */}

      {OpenAuction && (
        <AddCourseDialog
          show={open}
          handleClose={() => updateState({ OpenAuction: false })}
        />
      )}

      {/* Share the lesson  */}
      {openShareTheLesson && (
        <ShareTheLessonDialog
          show={openShareTheLesson}
          handleClose={() => updateState({ openShareTheLesson: false })}
        />
      )}
    </Box>
    </>
  );

async function getCourseListHandler() {
  const cacheKey = `course-page-${page}`;

  // Use cached data if available
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    console.log("Using cached data for", cacheKey);
    const { docs, totalPages } = JSON.parse(cachedData); // Parse the cached data from string
    updateState({ courseList: docs, pages: totalPages });
    return;
  }

  try {
    const res = await axios({
      method: "GET",
      url: Apiconfigs.myNft2List,
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        page,
        limit: 4,
      },
    });

    if (res.data.statusCode === 200) {
      const { docs, pages } = res.data.result;

      // Cache the result in sessionStorage
      sessionStorage.setItem(cacheKey, JSON.stringify({
        docs,
        totalPages: pages,
      }));

      updateState({ courseList: docs, pages });
      console.log("Fetched and cached data for", cacheKey);
    }
  } catch (err) {
    console.log(err.message);
  }
}

}

export const AddCoursePopup = ({ open, handleClose, callbackFun }) => {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [title, settitle] = useState("");
  const [name, setname] = useState("");
  const [donation, setdonation] = useState("");
  const [image, setimage] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isVideo, setIsVideo] = useState(false);
  const [details, setdetails] = useState("");
  const [process, setprocess] = useState(false);
  const [message, setmessage] = useState("");
  const [fire, setfire] = useState(false);
  const [duration, setDuration] = useState("7 Days");
  const [isSubmit, setIsSubmit] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [tokenImage, setTokenImage] = React.useState("/images/tokens/1.png");
  const [selectedToken, setSelectedToken] = useState(tokensDetails[0]);

  const post = async () => {
    setIsSubmit(true);
    if (
      image !== "" &&
      name !== "" &&
      title !== "" &&
      details !== "" &&
      donation !== "" &&
      parseFloat(donation) > 0
    ) {
      try {
        setmessage("Creating Course...");
        setprocess(true);
        const formData = new FormData();
        formData.append("file", image);
        formData.append("tokenName", name);
        formData.append("courseTitle", title);
        formData.append("duration", duration);
        formData.append("courseName", name);
        formData.append("details", details);
        formData.append("donationAmount", donation);
        formData.append("coinName", selectedToken.name);

        const res = await axios({
          method: "POST",
          url: Apiconfigs.addNft2,
          data: formData,
          headers: {
            token: sessionStorage.getItem("token"),
          },
        });

        if (res.data.statusCode === 200) {
          if (callbackFun) {
            callbackFun();
          }

          await user.updateUserData();
          setprocess(false);
          toast.success("Course created");
          setfire(!fire);
          handleClose();
          setname("");
          settitle("");
          setdonation("");
          setimage();
          setdetails("");
        } else {
          setprocess(false);
          toast.error("error");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const editor = useRef(null);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/{
  };
  return (
    <Dialog
      fullWidth="sm"
      maxWidth="sm"
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle className={classes.dailogTitle}>Create a course</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <label> Course Title</label>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                id="standard-basic"
                placeholder="Courses 1"
                className={classes.input_fild2}
                onChange={(e) => settitle(e.target.value)}
                error={
                  (isSubmit && title === "") || (isSubmit && title.length > 9)
                }
                helperText={
                  isSubmit && title === "" && "Please enter valid title"
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <label> Courses Name</label>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                id="standard-basic"
                placeholder="Basic Course"
                onChange={(e) => setname(e.target.value)}
                className={classes.input_fild2}
                error={isSubmit && name === ""}
                helperText={
                  isSubmit && name === "" && "Please enter valid name"
                }
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <label> Donation Amount</label>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <Input
                  placeholder="300"
                  className={classes.input_fild2}
                  type="number"
                  onChange={(e) => setdonation(e.target.value)}
                  onKeyPress={(event) => {
                    if (event?.key === "-" || event?.key === "+") {
                      event.preventDefault();
                    }
                  }}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      onClick={() => setOpenBuy(true)}
                    >
                      {tokenImage === "" ? (
                        "Select Token"
                      ) : (
                        <Box style={{ cursor: "pointer" }}>
                          <img src={selectedToken?.img} alt="" width={23} />
                          <ArrowDropDownIcon style={{ cursor: "pointer" }} />
                        </Box>
                      )}
                    </InputAdornment>
                  }
                />
              </Box>
            </Grid>

            {/* select Token */}

            {openBuy && (
              <Dialog
                fullWidth="sm"
                maxWidth="sm"
                open={openBuy}
                onClose={() => setOpenBuy(false)}
                aria-labelledby="max-width-dialog-title"
              >
                <DialogContent>
                  <DialogTitle className={classes.dailogTitle}>
                    Select a token
                  </DialogTitle>
                  {tokensDetails.map((data, i) => {
                    return (
                      <Box
                        key={i}
                        mt={3}
                        onClick={() => {
                          {
                            setSelectedToken(data);
                            setOpenBuy(false);
                          }
                        }}
                        className={classes.tokenList}
                      >
                        <Typography variant="h3">{data.name}</Typography>
                        <img
                          src={data.img}
                          style={{ height: 20, width: 20 }}
                          alt="coin"
                        />
                      </Box>
                    );
                  })}
                </DialogContent>
              </Dialog>
            )}
          </Grid>
        </Box>
        <Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <label> Duration</label>
            </Grid>
            <Grid item xs={12} md={8} className={classes.donation}>
              <span
                className={duration === "7 Days" ? "active" : null}
                onClick={() => setDuration("7 Days")}
              >
                7 Days
              </span>
              <span
                className={duration === "14 Days" ? "active" : null}
                onClick={() => setDuration("14 Days")}
              >
                14 Days
              </span>
              <span
                className={duration === "30 Days" ? "active" : null}
                onClick={() => setDuration("30 Days")}
              >
                30 Days
              </span>
              <span
                className={duration === "60 Days" ? "active" : null}
                onClick={() => setDuration("60 Days")}
              >
                60 Days
              </span>
              <span
                className={duration === "1 Year" ? "active" : null}
                onClick={() => setDuration("1 Year")}
              >
                1 Year
              </span>
            </Grid>
          </Grid>
        </Box>

        <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Upload a photo or video:</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <label htmlFor="raised-button-file">
                  <input
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    className={classes.input}
                    id="contained-button-file-add-bun"
                    multiple
                    onChange={(e) => {
                      setimage(e.target.files[0]);
                      setIsVideo(e.target.files[0].type.includes("video"));
                      setimageurl(URL.createObjectURL(e.target.files[0]));
                    }}
                    type="file"
                  />
                  {imageurl ? (
                    <>
                      {isVideo ? (
                        <ReactPlayer
                          url={imageurl}
                          playing
                          controls
                          width={"200px"}
                          height={"100%"}
                        />
                      ) : (
                        <img src={imageurl} alt="" width="200px" />
                      )}
                      <Box textAlign="center">
                        <Button
                          color="primary"
                          size="large"
                          variant="contained"
                          onClick={() => {
                            setimage("");
                            setimageurl("");
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <label htmlFor="contained-button-file-add-bun">
                      <Button
                        variant="outined"
                        color="primary"
                        component="span"
                      >
                        Upload image/video &nbsp;
                        <CloudUploadIcon />
                      </Button>
                    </label>
                  )}
                </label>
              </Box>
              {isSubmit && imageurl === "" && (
                <FormHelperText error>Please select image</FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box mb={2}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={12}>
              <label>Details:</label>
            </Grid>
            <Grid item xs={12} md={12}>
              <Box className={classes.UploadBox}>
                <TextField
                  id="standard-basic"
                  placeholder=""
                  className={classes.input_fild22}
                  onChange={(e) => setdetails(e.target.value)}
                  multiline
                  maxRows={6}
                  rows={6}
                  style={{ padding: "0px 10px" }}
                />
                {/* <JoditEditor
                  className={classes.input_fild22}
                  ref={editor}
                  value={details}
                  config={config}
                  tabIndex={1} // tabIndex of textarea
                  style={{ color: "#222" }}
                  onBlur={(newContent) => {
                    const temp = { ...details, newContent };
                    console.log("newContent", temp);
                    setdetails(newContent);
                  }} // preferred to use only this option to update the content for performance reasons
                  onChange={(newContent) => {
                    // const temp = { ...details, newContent }
                    setdetails(newContent);
                  }}
                /> */}
              </Box>
              {isSubmit && details === "" && (
                <FormHelperText error>
                  Please enter valid details
                </FormHelperText>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => handleClose(false)}
          color="primary"
          size="large"
        >
          cancel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={post}
          disabled={process}
        >
          {!process ? "Post" : message} {process && <ButtonCircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
    
  );
};

