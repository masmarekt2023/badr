import React, { useEffect, useState ,useRef } from "react";
import { useTranslation } from 'react-i18next';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {
  Grid,
  Input,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
  Popover,TextField,Tooltip,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Apiconfigs from "../Apiconfig/Apiconfigs";
import { tokensDetails } from "../constants/index";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinearProgress from "@mui/material/LinearProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { ArrowDropDown, ArrowUpward } from "@mui/icons-material";

const AddBundleDialog = ({ show, handleClose, bundleData }) => {
  const [isEdit, setIsEdit] = useState(!!bundleData);
  const classes = useStyles();
  const [mediaUrl, setMediaUrl] = useState(isEdit ? bundleData.mediaUrl : "");
  const [uploadCounter, setUploadCounter] = useState(0);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false); // State for category dialog
  const {t} = useTranslation();

  // Yup inputs validation
  const schema = yup.object({
    file: yup.mixed().required("File is required"),
    bundleTitle: yup.string().required("Enter title please"),
    bundleName: yup.string().required("Enter name please"),
    details: yup.string().required("Enter description please"),
    duration: yup.number().min(1, "Select a ending date"),
    donationAmount: yup
      .number()
      .min(1, "Enter donation amount please")
      .positive("the price should be positive number"),
    coinName: yup.string().required("Enter coin name"),
    category: yup.string().required("Select a category"), // Add category validation
  });

  // React hook form for handle form data
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
    register,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: {
      file: null,
      bundleTitle: isEdit ? bundleData.bundleTitle : "",
      bundleName: isEdit ? bundleData.bundleName : "",
      donationAmount: isEdit ? bundleData.donationAmount : "",
      duration: isEdit ? +bundleData.duration.split(" ")[0] : "",
      details: isEdit ? bundleData.details : "",
      coinName: isEdit ? bundleData.coinName : "MAS",
      category: isEdit ? bundleData.category : "", // Initialize category
    },
  });

  useEffect(() => {
    setMediaUrl(isEdit ? bundleData.mediaUrl : "");
  }, [show]);

  // List of categories
  const categories = [
    "Analytics",
    "Agriculture",
    "Architecture",
    "Art",
    "Artificial Intelligence",
    "Blockchain",
    "Cars",
    "Cloud Computing",
    "Coding",
    "Collectors",
    "Crypto",
    "Cybersecurity",
    "Data Science",
    "Digital Marketing",
    "E-commerce",
    "Education",
    "Fashion",
    "Finance",
    "Gaming",
    "Health & Fitness",
    "History",
    "Internet of Things",
    "Machine Learning",
    "Metaverse",
    "Mobile Development",
    "Music",
    "News",
    "Photography",
    "Privacy",
    "Productivity",
    "Psychology",
    "Real Estate",
    "Robotics",
    "Security",
    "Social Media",
    "Software Development",
    "Space Exploration",
    "Sports",
    "Startups",
    "Sustainability",
    "Trading",
    "Travel",
    "UI/UX Design",
    "Video",
    "Virtual Reality",
    "Wallets",
    "Web3",
    "Writing",
    "Yoga",
    "Zoology",
   
  ];

  // Open category dialog
  const handleOpenCategoryDialog = () => {
    setCategoryDialogOpen(true);
  };

  // Close category dialog
  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setValue("category", category); // Update the form value
    handleCloseCategoryDialog(); // Close the dialog
  };

const convertImageToWebP = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Image conversion to WebP failed"));
          }
        },
        "image/webp",
        0.8 // quality (0.0 to 1.0)
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

  

  /* Main Return */
  return (
    <Dialog
    fullWidth={true}
    maxWidth={"lg"}
    open={show}
    onClose={uploadCounter === 0 ? handleClose : null}
    aria-labelledby="max-width-dialog-title"
    dir='ltr'
    scroll="body"
    >
      <DialogTitle
        sx={{ 
          textAlign: "center", 
          color: "black", 
          fontWeight: "bold", 
          fontSize: "1.5rem",
          py: 1
   }}
      >
        {isEdit ? t("Edit Bundle") : t("Create A Bundle")}
      </DialogTitle>
      <DialogContent  sx={{ p: "0 20px", overflow: 'hidden' }}>
       
        <Grid container spacing={2} sx={{ flex: 1, overflow: 'auto',maxWidth:"100%" }}>
          {InputList()}
          <Grid item xs={12} sm={5}>
            {MediaInput()}
            {MediaBox()}
          </Grid>
          {FormButtons()}
        </Grid>
        
      </DialogContent>

      {/* Category Selection Dialog */}
      <Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog}>
        <DialogTitle align="center" sx={{fontSize:"18px" ,color:(theme) => theme.custom.mainButton}}>{t("Select a Category")}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            {categories.map((category, index) => (
              <Button
                key={index}
                onClick={() => handleCategorySelect(category)}
                sx={{ margin: "5px 0" ,color:(theme) => theme.custom.mainButton}}
              >
                {category}
              </Button>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Dialog>
  );

  /* Main Return */

  function MediaBox() {
    const { name } = watch("file") ? watch("file") : { type: "", name: "" };

    const isVideo = watch("file")
      ? watch("file")?.type?.split("/")[0] !== "image"
      : isEdit
      ? isVideoType(mediaUrl)
      : false;

    const onRemove = () => {
      setMediaUrl("");
      setValue("file", null);
    };

    return (
      <Box
        sx={{ display: mediaUrl !== "" ? "block" : "none" }}
        className={classes.mediaBox}
        mb={1}
      >
        {isVideo ? (
          <div style={{ borderRadius: "10px 10px 0px 0px", overflow: "hidden" }}>
            <ReactPlayer
              url={mediaUrl}
              playing
              controls
              width={"100%"}
              height={"100%"}
            />
          </div>
        ) : (
          <img
            src={mediaUrl}
            width="100%"
            
            alt={"bundle image"}
            style={{ borderRadius: "10px 10px 0px 0px" ,height:"200px" }}
          />
        )}
        <div className={classes.mediaBoxInfo}>
          <div>
            <p style={{ color: "#777", fontWeight: "600", margin: 0, fontSize: 14 }}>{t("Filename")}</p>
            <p style={{ marginTop: 5, fontWeight: "500" }}>{name ? name : ""}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <DeleteIcon
              fontSize={"medium"}
              style={{ color: "red", cursor: "pointer" }}
              onClick={onRemove}
            />
          </div>
        </div>
        {uploadCounter > 0 && (
          <div className={classes.uploadCounter}>
            <p>{t("Uploading")} {uploadCounter}%</p>
            <LinearProgress
              variant="determinate"
              value={uploadCounter}
              sx={{
                marginTop: "10px",
                width: "100%",
                height: 10,
                borderRadius: 5,
                backgroundColor: " #e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: (theme) => theme.custom.mainButton,
                },
              }}
            />
          </div>
        )}
      </Box>
    );
  }

  function FormButtons() {
    const onSubmit = handleSubmit(async (data) => {
      try {
        if (isEdit) {
          await editBundle(data);
        } else {
          await createBundle(data);
        }
        window.location.reload(); // Force full page refresh
      } catch (error) {
        console.error("Submission error:", error);
      }
    }, () => console.log(errors));


    

    return (
      <Grid xs={12} className={classes.buttonContainerStyle}>
        <Button
          variant="contained"
          onClick={handleClose}
          color="primary"
          size="large"
          sx={{ fontSize: "15px", background: (theme) => theme.custom.mainButton, color: "white", margin: "0 5px",
              "&:hover":{
                background:(theme) => theme.custom.hoverMainButton
              } }}
        >
          {t("Cancel")}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={onSubmit}
          size="large"
          disabled={isEdit && !dirtyFields.file}
          sx={{ fontSize: "15px", background:(theme) => theme.custom.mainButton, color: "white", margin: "0 5px",
              "&:hover":{
                background:(theme) => theme.custom.hoverMainButton
              } }}
        >
          {isEdit ? t("Edit") : t("Create")}
        </Button>
      </Grid>
    );
  }

  function MediaInput() {
    const {
      field,
      fieldState: { error },
    } = useController({
      name: "file",
      control,
    });

    const { onChange, ref, name } = field;

    return (
      
      <label htmlFor="raised-button-file">
        <input
          accept="image/*,video/*"
          style={{ display: "none" }}
          className={classes.input}
          id="contained-button-file-add-bun"
          multiple
         onChange={async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const isImage = file.type.startsWith("image/");
  if (isImage) {
    const convertedWebPBlob = await convertImageToWebP(file);
    const webpFile = new File([convertedWebPBlob], file.name.replace(/\.\w+$/, ".webp"), {
      type: "image/webp",
    });

     // 🔍 Log details
    console.log("Original file:", file);
    console.log("Converted WebP file:", webpFile);
    console.log("WebP Name:", webpFile.name);
    console.log("WebP Size (KB):", (webpFile.size / 1024).toFixed(2));
    console.log("WebP Type:", webpFile.type);
    onChange(webpFile);
    setMediaUrl(URL.createObjectURL(webpFile));
  } else {
    onChange(file); // Keep video files as-is
    setMediaUrl(URL.createObjectURL(file));
  }
}}
          ref={ref}
          name={name}
          type="file"
        />
        <label htmlFor="contained-button-file-add-bun">
         
          <Button
            variant="outined"
            color="primary"
            component="span"
            className={classes.uploadBox}
            sx={{
              display: mediaUrl === "" ? "flex" : "none",
            }}
          >
            
            <div
              style={{
                width:"100%",
                height:"100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid rgb(199, 196, 196)",
                padding: "60px 10px",
                borderRadius: "10px",
              }}
            >
               <Tooltip title={<div>
        <div>Max-Size: 1024 Mb</div>
        <div>min-width: 300px</div>
        <div>min-hieght: 160px</div>
        </div>}
         placement="bottom" >
              <div className={classes.uploadIcon}>
                <CloudUploadIcon sx={{fontSize:{xs:"2rem",md:"4rem"}}}/>
              </div>
               </Tooltip>
              <div style={{ margin: 15, textAlign: "center" }}>
                <Typography sx={{ margin: "5px 0px 0px 0px", fontSize:{xs:"0.8rem",md:"1.5rem"} }}>{t("Select Image/Video")}</Typography>
              
              </div>
            </div>
           
          </Button>
          
        </label>
      </label>
      
    );
  }

  function InputList() {
    return (
      <Grid item xs={12} sm={7}>
  <TextField
    {...register("bundleTitle")}
    label={t("Bundle Title")}
    placeholder={t("Enter Bundle Title")}
    disabled={isEdit}
    inputProps={{ maxLength: 16 }}
    fullWidth
    margin="normal"
    error={!!errors["bundleTitle"]}
    helperText={errors["bundleTitle"]?.message}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors["bundleTitle"] ? "red" : ""
        },
      },
    }}
  />

  <TextField
    {...register("bundleName")}
    label={t("Bundle Name")}
    placeholder={t("Enter Bundle Name")}
    disabled={isEdit}
    inputProps={{ maxLength: 16 }}
    fullWidth
    margin="normal"
    error={!!errors["bundleName"]}
    helperText={errors["bundleName"]?.message}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors["bundleName"] ? "red" : ""
        },
      },
    }}
  />

  <TextField
    {...register("category")}
    label={t("Category")}
    placeholder={t("Select a Category")}
    disabled={isEdit}
    fullWidth
    margin="normal"
    InputLabelProps={{
                shrink: true,
              }}
    InputProps={{
      readOnly: true,
      endAdornment: (
        <InputAdornment position="end" sx={{cursor:"pointer"}}>
          <ArrowDropDown />
        </InputAdornment>
      ),
    }}
    onClick={handleOpenCategoryDialog}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: ""
        },
      },
    }}
  />

  <TextField
    {...register("donationAmount")}
    label={t("Amount")}
    placeholder={t("Enter Amount")}
    type="number"
    fullWidth
    margin="normal"
    disabled={isEdit}
    error={!!errors["donationAmount"]}
    helperText={typeof watch("donationAmount") === "number" && errors["donationAmount"]?.message}
    InputProps={{
      inputProps: { min: 0 },
      endAdornment: <InputAdornment position="end">
                    <CoinSelector />
                  </InputAdornment>
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors["donationAmount"] ? "red" : ""
        },
      },
    }}
  />

  <TextField
    {...register("duration")}
    label={t("Duration")}
    placeholder={t("Enter Duration")}
    type="number"
    fullWidth
    margin="normal"
    disabled={isEdit}
    error={!!errors["duration"]}
    helperText={typeof watch("duration") === "number" && errors["duration"]?.message}
    InputProps={{
      inputProps: { min: 0 },
      endAdornment: <p style={{ margin: "0px 10px", fontSize: 14 }}>{t("Days")}</p>
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors["duration"] ? "red" : ""
        },
      },
    }}
  />

  <TextField
    {...register("details")}
    label={t("Details")}
    placeholder={t("Enter a details about your bundle")}
    fullWidth
    margin="normal"
    disabled={isEdit}
    rows={1}
    error={!!errors["details"]}
    helperText={errors["details"]?.message}
    inputProps={{ maxLength: 50 }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors["details"] ? "red" : ""
        },
      },
    }}
  />
</Grid>
    );
  }

  function CoinSelector() {
    return (
      <InputAdornment position="end">
        <Select
          className={classes.select}
          value={watch("coinName")}
          onChange={(event) => setValue("coinName", event.target.value)}
          disabled={isEdit}
           sx={{
          height: '40px',
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            paddingRight: '24px !important',
            gap:1,

          }
        }}
        >
          {tokensDetails.map((item, index) => (
            <MenuItem
                        key={index}
                        value={item.name}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <img 
                          src={`/${item.img}`} 
                          alt={item.name} 
                          style={{ width: '20px', height: '20px' }} 
                        />
                        {item.name}
                      </MenuItem>
          ))}
        </Select>
      </InputAdornment>
    );
  }
  
 async function createBundle(data) {
  try {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("tokenName", data.bundleName);
    formData.append("bundleTitle", data.bundleTitle);
    formData.append(
      "duration",
      `${data.duration} ${data.duration > 1 ? "days" : "day"}`
    );
    formData.append("bundleName", data.bundleName);
    formData.append("details", data.details);
    formData.append("donationAmount", data.donationAmount);
    formData.append("coinName", data.coinName);
    formData.append("category", data.category);

    const res = await axios({
      method: "POST",
      url: Apiconfigs.addNft,
      data: formData,
      headers: {
        token: sessionStorage.getItem("token"),
      },
      onUploadProgress: (progressEvent) => onUploadProgress(progressEvent),
    });

    if (res.data.statusCode === 200) {
      toast.success("Bundle created");
      
    
      
      // Clear bundle-specific caches if you have any
       Object.keys(sessionStorage).forEach(key => {
         if (key.startsWith('bundle-page-')) {
           sessionStorage.removeItem(key);
         }
       });

      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('refreshBundleList'));
      
      handleClose();
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to create bundle");
  }
}

  async function editBundle(data) {
    const formData = new FormData();
    formData.append("_id", bundleData._id);
    formData.append("mediaUrl", data.file);
    try {
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.editNft,
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: sessionStorage.getItem("token"),
        },
        onUploadProgress: (progressEvent) => onUploadProgress(progressEvent),
      });
      if (res.data.statusCode === 200) {
        toast.success("Bundle edited successfully");
        handleClose();
      }
    } catch (e) {
      console.log(e);
    }
  }

  function onUploadProgress(progressEvent) {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadCounter(percentCompleted);
  }

  function isVideoType(url) {
    //return url.includes("video");
  }
};

export default AddBundleDialog;

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    border: "1px solid #ddd",
    borderRadius: 5,
    padding: "8px",
    marginBottom: 8,
    "& label": {
      fontWeight: "500",
      color: "black",
      fontSize: 14,
    },
  },
  input: {
    width: "100%",
    "&::before, &::after": {
      content: "none",
    },
  },

  select: {
    "&::before": {
      content: "none",
    },
    "&::after": {
      content: "none",
    },
    "& div:focus": {
      background: "transparent",
    },
    "&>div": {
      display: "flex",
      alignItems: "center",
    },
  },

  uploadBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    height: "calc(100% - 10px)",
    border: "2px #ddd solid",
    "&>.MuiButton-label": {
      flexDirection: "column",
    },
  },

  uploadIcon: {
    width: 100,
    height: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px #ddd solid",
    borderRadius: "50%",
     [theme.breakpoints.down('sm')]: {
      height:"100%"
    },
  },

  buttonContainerStyle: {
    padding: "0px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  submitButton: {
    backgroundColor: "rgb(192, 72, 72)",
    color: "#fff",
    "&:hover": {
      boxShadow: "0px 0px 0px 0px",
      backgroundColor: "rgba(192, 72, 72, 0.95) !important",
    },
  },

  mediaBox: {
    width: "100%",
    marginBottom: 0,
  },

  mediaBoxInfo: {
    background: "rgba(0,0,0,0.1)",
    marginTop: -6,
    padding: 20,
    borderRadius: "0px 0px 10px 10px",
    height: "50%",
  },

  uploadCounter: {
    position: "relative",
    marginTop: 30,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadCounterIcon: {
    position: "absolute",
    marginBottom: 20,
    animation: "$upAndDown 2s ease-in-out infinite",
  },

  "@keyframes upAndDown": {
    "0%": {
      top: 0,
    },
    "50%": {
      top: -15,
    },
    "100%": {
      top: 0,
    },
  },
}));