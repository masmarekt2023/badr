import React, { useEffect, useState } from "react";
import Dialog from "@mui/material//Dialog";
import DialogTitle from "@mui/material//DialogTitle";
import DialogContent from "@mui/material//DialogContent";
import {
  Grid,
  Input,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  IconButton,
  Box,Popover,
  Typography,TextField,Tooltip
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ArrowDropDown, ArrowUpward } from "@mui/icons-material";

import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Apiconfigs from "../Apiconfig/Apiconfigs";
import { tokensDetails } from "../constants/index";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import LinearProgress from "@mui/material/LinearProgress";
import { useTranslation } from 'react-i18next';


import { toast } from "react-toastify";

const AdditemDialog = ({ show, handleClose, itemData }) => {
  const [isEdit, setIsEdit] = useState(!!itemData);
  const classes = useStyles();
  const [mediaUrl, setMediaUrl] = useState(isEdit ? itemData.mediaUrl : "");
  const [mediaUrls, setMediaUrls] = useState(isEdit && Array.isArray(itemData.mediaUrls) ? itemData.mediaUrls : []);
       const {t} = useTranslation();
 

  const [uploadCounter, setUploadCounter] = useState(0);

  // Yup inputs validation
  const schema = yup.object({
    file: yup.mixed().required("File is required"),
    itemTitle: yup.string().required("Enter title please"),
    itemName: yup.string().required("Enter name please"),
    details: yup.string().required("Enter description please"),
    duration: yup.number().min(1, "Select a ending date"),
    donationAmount: yup
      .number()
      .min(1, "Enter donation amount please")
      .positive("the price should be positive number"),
    coinName: yup.string().required("Enter coin name"),
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
      itemTitle: isEdit ? itemData.itemTitle : "",
      itemName: isEdit ? itemData.itemName : "",
      donationAmount: isEdit ? itemData.donationAmount : "",
      duration: isEdit ? +itemData.duration.split(" ")[0] : "",
      details: isEdit ? itemData.details : "",
      coinName: isEdit ? itemData.coinName : "MAS",
    },
  });

  useEffect(() => {
    setMediaUrl(isEdit ? itemData.mediaUrl : "");
  }, [show]);

  // Utility function to convert image to WebP
const convertImageToWebP = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.match('image.*')) {
      resolve(file); // Return original if not an image
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(file); // Fallback to original if conversion fails
            return;
          }
          
          const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now()
          });
          resolve(webpFile);
        }, 'image/webp', 0.8); // 0.8 is quality (0 to 1)
      };
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
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
      dir="ltr"
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
        {isEdit ? t("Edit item") : t("Create Item")}
      </DialogTitle>
      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        
  <Grid container  spacing={2} sx={{ flex: 1, overflow: 'auto' }}>
    {InputList()}
    <Grid item xs={12} sm={5} style={{ textAlign: 'center' }}>
      {MediaBox()}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
        {MediaInput()}
      </div>
    </Grid>
    {FormButtons()}
  </Grid>
</DialogContent>
    </Dialog>
  );

  /* Main Return */

  function MediaBox() {
    const maxImages = 9;
    const emptySlots = maxImages - mediaUrls.length;

    return (
      <Box sx={{ 
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 1,
        border: '1px solid #ddd',
        borderRadius: 1,
        mb: 2
      }}>
        <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 'bold', color: '#666' }}>
          {t("Upload your images here")}
        </Typography>
        <Grid container spacing={1}>
          {mediaUrls.map((url, index) => (
            <Grid item xs={4} key={index}>
              <Box sx={{ 
                position: 'relative',
                height: 100,
                border: '1px solid #eee',
                borderRadius: 1,
                overflow: 'hidden'
              }}>
                <img 
                  src={url} 
                  alt={`Selected ${index + 1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <IconButton 
                  onClick={() => removeImage(index)} 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    color: 'error.main',
                    backgroundColor: 'rgba(255,255,255,0.7)'
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
          {Array.from({ length: emptySlots }, (_, i) => (
            <Grid item xs={4} key={i + mediaUrls.length}>
              <Box 
                onClick={() => document.getElementById('file-input').click()}
                sx={{
                  height: 100,
                  border: '2px dashed #ddd',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <CloudUploadIcon sx={{ color: 'text.disabled' ,fontSize:"40px"}} />
              </Box>
            </Grid>
          ))}
        </Grid>
        {uploadCounter > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" align="center">
              {t("Uploading")} {uploadCounter}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadCounter}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'primary.dark',
                },
              }}
            />
          </Box>
        )}
      </Box>)
}

function removeImage(index) {
    const filteredUrls = mediaUrls.filter((_, idx) => idx !== index);
    setMediaUrls(filteredUrls);
}


function FormButtons() {
  const onSubmit = handleSubmit(async (data) => {
    try{
      if(isEdit){
        await edititem(data)
      }
      else {
        await createitem(data)
      }
      window.location.reload()
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
          sx={{ background:(theme) => theme.custom.mainButton,color:'white',margin:"0 5px",
              "&:hover":{
                background:(theme) => theme.custom.hoverMainButton
              }}}

        >
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          size="large"
          sx={{ background:(theme) => theme.custom.mainButton,color:'white',margin:"0 5px",
              "&:hover":{
                background:(theme) => theme.custom.hoverMainButton
              }}}

          disabled={isEdit && !dirtyFields.file}
        >
          {isEdit ? t("Edit") : t("Create")}
        </Button>
      </Grid>
    );
  }

  function MediaInput() {
    const { field } = useController({
        name: "file",
        control,
    });

    const { onChange, ref, name } = field;

   const handleFileChange = async (files) => {
  if (files.length > 0) {
    try {
      const file = files[0];
      
      // Convert to WebP if it's an image
      const processedFile = await convertImageToWebP(file);
      
      // Create URL for preview (works with both original and converted files)
      const newUrl = URL.createObjectURL(
        processedFile.type === 'image/webp' ? processedFile : file
      );

      console.log("oldweb",file);
      console.log("newweb",processedFile);
      
      setMediaUrls([...mediaUrls, newUrl]);
      
      // Update form field with the processed file
      setValue("file", processedFile, { shouldValidate: true });
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Error processing image");
    }
  }
};
  

    return (
        <>
            <input
                accept="image/*"
                style={{ display: "none" }}
                className={classes.input}
                id="file-input"
                multiple={false}
                onChange={(e) => {
                    onChange(e.target.files[0]);
                    handleFileChange(e.target.files);
                }}
                ref={ref}
                name={name}
                type="file"
            />
        </>
    );
}

  function InputList() {
    return (
    <Grid item xs={12} sm={7}>
  {/* Item Title */}
  <TextField
    {...register("itemTitle")}
    label={t("Item Title")}
    placeholder={t("Enter Item Title")}
    disabled={isEdit}
    fullWidth
    margin="normal"
    error={!!errors.itemTitle}
    helperText={errors.itemTitle?.message}
    inputProps={{ maxLength: 16 }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors.itemTitle ? "red" : ""
        },
      },
    }}
  />

  {/* Item Name */}
  <TextField
    {...register("itemName")}
    label={t("Item Name")}
    placeholder={t("Enter Item Name")}
    disabled={isEdit}
    fullWidth
    margin="normal"
    error={!!errors.itemName}
    helperText={errors.itemName?.message}
    inputProps={{ maxLength: 16 }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors.itemName ? "red" : ""
        },
      },
    }}
  />

  {/* Donation Amount */}
  <TextField
    {...register("donationAmount")}
    label={t("Amount")}
    placeholder={t("Enter Amount")}
    type="number"
    disabled={isEdit}
    fullWidth
    margin="normal"
    error={!!errors.donationAmount}
    helperText={typeof watch("donationAmount") === "number" && errors.donationAmount?.message}
    InputProps={{
      inputProps: { min: 0 },
        endAdornment: <InputAdornment position="end">
                          <CoinSelector />
                        </InputAdornment>
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors.donationAmount ? "red" : ""
        },
      },
    }}
  />

  {/* Duration */}
  <TextField
    {...register("duration")}
    label={t("Duration")}
    placeholder={t("Enter Duration")}
    type="number"
    disabled={isEdit}
    fullWidth
    margin="normal"
    error={!!errors.duration}
    helperText={typeof watch("duration") === "number" && errors.duration?.message}
    InputProps={{
      inputProps: { min: 0 },
      endAdornment: (
        <Typography variant="body2" sx={{ margin: "0px 10px" }}>
          {t("Days")}
        </Typography>
      )
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors.duration ? "red" : ""
        },
      },
    }}
  />

  {/* Details */}
  <TextField
    {...register("details")}
    label={t("Details")}
    placeholder={t("Enter your item's details")}
    disabled={isEdit}
    multiline
    rows={1}
    fullWidth
    margin="normal"
    error={!!errors.details}
    helperText={errors.details?.message}
    inputProps={{ maxLength: 50 }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: errors.details ? "red" : ""
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


  async function createitem(data) {
    try {
        const formData = new FormData();
        // Append text fields first
        formData.append("itemTitle", data.itemTitle);
        formData.append("itemName", data.itemName);
        formData.append("details", data.details);
        formData.append("donationAmount", data.donationAmount);
        formData.append("duration", `${data.duration} ${data.duration > 1 ? "days" : "day"}`);
        formData.append("coinName", data.coinName);
        // Append URLs as separate fields
        mediaUrls.forEach((url, index) => {
          formData.append(`url${index + 1}`, url); // Appending as url1, url2, ..., url9
      });

        // Convert URLs to File objects and append them
        const filePromises = mediaUrls.map(async (url, index) => {
            const response = await fetch(url);
            const blob = await response.blob();
            return new File([blob], `image${index}.png`, { type: 'image/png' });
        });

        const files = await Promise.all(filePromises);
        files.forEach(file => formData.append("images", file));

        const res = await axios({
          method: "POST",
          url: Apiconfigs.addNft1,
          data: formData,
          headers: {
            token: sessionStorage.getItem("token"),
          },
          onUploadProgress: (progressEvent) => onUploadProgress(progressEvent),
        });

        if (res.data.statusCode === 200) {
            toast.success("Item created successfully");
            Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('item-page-')) {
          sessionStorage.removeItem(key);
        }
      });

      // Optionally, force-refresh the data
      window.dispatchEvent(new CustomEvent('refreshItemList'));
      
      handleClose();
            
        } else {
            throw new Error('Failed to create item');
        }
    } catch (err) {
        console.error(err);
        toast.error("An error occurred while creating the item.");
    }
   
}

  async function edititem(data) {
    const formData = new FormData();
    formData.append("_id", itemData._id);
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
        toast.success("item edited successfully");
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
    return url.includes("video");
  }
};

export default AdditemDialog;

const useStyles = makeStyles(() => ({
  inputContainer: {
    borderWidth: 2,
    borderColor: "#2f0032",
    borderStyle: "solid",
    borderRadius: 5,
    padding: "10px",
    marginBottom: 10,
    transition: "border-color 0.3s ease-in",
    "&:focus-within": {
      borderColor: "rgb(192, 72, 72)",
      "& label": {
        color: "rgb(192, 72, 72)",
        transition: "color 0.3s ease-in",
      },
    },
    "&>label": {
      fontWeight: "500",
      color: "black",
      fontSize: 14,
    },
  },
  deleteIcon: {
    color: 'red', // Set the color property to red
},

  input: {
    width: "100%",
    "&::before": {
      content: "none",
    },
    "&::after": {
      content: "none",
    },
    "&>input": {
      width: "100%",
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
  },

  buttonContainerStyle: {
    padding: "0px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

  mediaPreview: {
    width: '100%',  // Same as empty box width
    height: '100px', // Same as empty box height
    overflow: 'hidden', // Ensures no part of the image spills out
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #ccc',  // Optional, for visual consistency
    borderRadius: '5px',       // Optional, matches empty box
},
img: {
    width: 'auto',
    height: '100%', // Ensures the image covers the full height
    maxWidth: '100%',  // Ensures the image width does not exceed the box
},


mediaBoxHeader: {
  width: '100%',
  marginBottom: '10px', // Adjust spacing as needed
  color: '#666',
  textAlign: 'center',
  fontWeight: 'bold',
},


emptyBox: {
  width: '100%',
  height: '40px',
  border: '2px dashed #ccc',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
},
plusIcon: {
  fontSize: '24px',
  color: '#ccc',
},

uploadCounter: {
  position: "relative",
  marginTop: 30,
  padding: 20,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Ensures vertical centering in the column
  alignItems: "center", // Centers content horizontally
  width: '100%', // Ensures it takes the full width of its container
  textAlign: 'center', // Centers any text inside the div
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
