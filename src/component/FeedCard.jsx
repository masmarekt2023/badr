import React, { useContext, useEffect } from "react";
import {
  Typography,
  Box,
  Badge,
  IconButton,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { UserContext } from "src/context/User";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { nFormatter } from "src/utils";
import { saveAs } from "file-saver";

const useStyles = makeStyles(() => ({
  token: {
    textAlign: "center",
    padding: "20px 0",
    "& p": {
      fontSize: "14px",
      fontWeight: "500",
      lineHight: "20px",
      color: "#000",
    },
    "& img": {
      marginTop: "5px",
    },
  },
  // feedBox: {
  //   border: "solid 0.5px #e5e3dd",
  //   boxShadow: "0px 1px 6px #0000000d",
  //   transform: "translate(2%, -2%)",
  //   fontFamily: 'adobe-clean", sans-serif',
  //   padding: "20px",
  //   borderRadius: "15px",

  //   marginLeft: "-10%",
  //   // position: "relative",
  //   "& p": {
  //     fontSize: "14px",
  //     marginTop: "15px",
  //   },
  // },
  cards: {
    border: "solid 0.5px #c9c7c3",
    color : "white",
    width: "270px",
    maxWidth: "450px",
    height: "550px",
    maxHeight: "600px",
    padding: "10px",
    borderRadius: "34px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    marginRight : "10px",
    // backgroundColor: "#fff",
    height: 450,
    transform:"scale(0.8)",
    
   
    margin: "0 10px",
    position: "relative",
    "&:hover": {
      transform: "scale(0.85)",
      transition: "all 0.4s ease-in-out 0s",
    },
  },
  feedpost: {
    marginTop: "8px",
  },
  imageClass: {
    width: "100%",
    height: "300px",
    "@media(max-width:768px)": {
      width: "100%",
    },
  },
  LikeBox: {
    fontSize: "20px",
    cursor: "pointer",
  },
  feedmenu: {
    fontSize: "20px",
    color: "#707070",
    position: "absolute",
    right: "10px",
    top: "10px",
  },
  blurBox: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: "9",
    display: "flex",
    justifyContent: " center",
    alignItems: "center",
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "bold",
    color: " #141518",
    backgroundColor: "#ffffff80",
    "& span": {
      color: "#f26a6a",
    },
  },
  img: {
    position: "absolute",
    margin: "-8px",
    width: "6%",
    marginLeft: "5px",
  },
  downloadButton: {
    maxWidth: "100px",
    backgroundColor: "#a33748",
    borderRadius: "33px",
    color: "white",
    marginTop: 10,
    "&:hover": {
      backgroundColor: "red",
    },
  },
  nftImg: {
    width: "100%",
    // height: "165px",
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    // borderRadius: "40px 40px 10px 10px",
    // borderRadius: "18px",
    backgroundColor: "#ccc !important",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function UsersCard({ data, index, updateList }) {
  const navigate = useNavigate();
  const auth = useContext(UserContext);
  const classes = useStyles();
  let isLike = false;

  const likeDislikeFeedHandler = async () => {
    axios({
      methods: "GET",
      url: Apiconfigs.likeDislikeFeed + data._id,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.responseMessage);
          if (updateList) {
            updateList();
          }
        } else {
          toast.error(res.data.responseMessage);
        }
      })
      .catch((res) => {
        console.log(res.message);
      });
  };

  const isVideo = data.mediaUrl.includes(".mp4");
  if (auth?.userData?._id) {
    const likeUser = data.likesUsers.filter(
      (data) => data === auth.userData._id
    );
    isLike = likeUser.length > 0;
  }

  const downLoadFile = () => {
    saveAs(data?.mediaUrl);
  };
  const updateDimensions = () => {
    if (data?._id) {
      let offsetWidth = document.getElementById(
        "imagecard" + data?._id
      ).offsetWidth;
      let newoofsetWidth = offsetWidth - 60;
      document.getElementById("imagecard" + data?._id).style.height =
        newoofsetWidth + "px";
    }
  };
  useEffect(() => {
    updateDimensions();
  }, [data, index]);
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return (
    <Box className={classes.cards} sx={{background: (theme) => theme.custom.CarBackGround}}>
      <Box className={classes.feedBox}>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <figure>
              <img
                src={
                  data && data.userId && data.userId.profilePic
                    ? data.userId.profilePic
                    : "images/user-profile.png"
                }
                alt=""
              />
            </figure>
            <div>

              {/*<Typography
                style={{
                  width: "auto",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {data?.userId?.name}
                <img src="/images/blue-check.png" className={classes.img} />
              </Typography>*/}
              &nbsp;
             
            </div>
          </Box>
        </Box>
        <Box style={{height: 50}}>
          <Typography
              variant="h6"
              style={{
                marginBottom: "-10px",
                fontWeight: 500,
                width: "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color : "white !important",
              }}
          >
            {data?.nftId[0]?.bundleName} 
          </Typography>
          <Typography
              variant=""
              style={{
                marginBottom: "-10px",
                fontWeight: 500,
                width: "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color : "#fff !important",
              }}
          >
            {data.title} 
          </Typography>
          <Typography
              variant="body1"
              component="p"
              style={{
                fontWeight: 400,
                fontSize: "13px",
                color: "#3f3f3",
                marginTop: "8px",
                width: "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              dangerouslySetInnerHTML={{
                __html: data.details,
              }}
          ></Typography>
        </Box>
        <Box className={classes.feedpost}>
          {isVideo ? (
            <>
              <Box id={`imagecard${data._id}`}>
                <video controls style={{ width: "100%", height: '100%',marginBottom : "10px" }}>
                  <source src={data.mediaUrl} type="video/mp4" />
                </video>
              </Box>
              <Button
                  className={"primaryButton"}
                  style={{marginTop : "15px" ,height : "20px"}}
                  onClick={downLoadFile}
              >
                Download
              </Button>
            </>
          ) : (
            // <img
            //   className={classes.imageClass}
            //   src={data?.mediaUrl ? data.mediaUrl : "images/feed1.png"}
            // />
            <Box
              id={`imagecard${data._id}`}
              className={classes.nftImg}
              style={{
                background: "url(" + data.mediaUrl + ")",
              }}
            >

            </Box>
          )}
        </Box>
        <Box   style={{ padding: "5px" }}>
          <IconButton >
            <FaHeart
              style={isLike ? { color: "#d15b5b" } : {color:"white"}}
              onClick={() => likeDislikeFeedHandler(data._id)}
            />
          </IconButton>
          &nbsp;
          <Badge
            style={{ marginTop: "-4px" }}
            badgeContent={nFormatter(parseFloat(data.likesCount), 1)}
          ></Badge>
          &nbsp;<span>Likes</span>
        </Box>
        <Typography variant="body" component="small">
                Created At {moment(data.createdAt).format("DD-MM-YYYY HH:mm")}
              </Typography>
      </Box>
    </Box>
  );
}
