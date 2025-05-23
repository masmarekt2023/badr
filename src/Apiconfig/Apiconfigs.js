
//export let baseURL = "https://mas-server-lk9j.onrender.com";


// export let baseURL = "https://node.masplatform.net";
// export let baseURL = "http://localhost:1865";
// export let baseURL = "https://mas-server-lk9j.onrender.com";
// export let pageURL = "https://masplatform.net"
// export let pageURL = "http://localhost:1865"
// export let socketURL = "wss://node.masplatform.net";
//export let baseURL = "https://masplatform-xoep.onrender.com";
//export let pageURL = "https://masplatform-xoep.onrender.com";
//export let socketURL = "wss://masplatform-xoep.onrender.com";

export let baseURL = "https://node.masplatform.net";
export let pageURL = "https://masplatform.net"
export let socketURL = "wss://node.masplatform.net";


//export let  baseURL = "http://localhost:1865";
//export let socketURL = "ws://localhost:1865";
//export let pageURL = "http://localhost:1865"


/*if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
   baseURL = "http://localhost:1865";
   socketURL = "ws://localhost:1865";
}*/

const url = `${baseURL}/api/v1`;

const Apiconfigs = {
    connectWallet: `${url}/user/connectWallet`,
    updateprofile: `${url}/user/updateProfile`,
    deleteProfile: `${url}/user/deleteProfile`,
    deactivateProfile: `${url}/user/deactivateProfile`,
    processing: `${url}/user/processing`,
    donationTransactionlist: `${url}/user/donationTransactionlist`,
    sendOtp: `${url}/user/send-otp`,
    verifyOtp: `${url}/user/verify-otp`,
    profile: `${url}/user/profile`,
    myfeed: `${url}/user/myFeed`,
    getMyfeed: `${url}/user/getMyFeed`,
    myauction: `${url}/nft/listNFT`,
    mynft: `${url}/nft/nft/`,
    mynft1: `${url}/nft/nft1/`,
    mynft2: `${url}/nft/nft2/`,
    bundleList: `${url}/nft/bundleList`,
    courseList: `${url}/nft/courseList`,
    nftall: `${url}/nft/allNftList`,
    likeDislikeFeed: `${url}/user/likeDislikeFeed/`,
    unSubscription: `${url}/user/unSubscription?_id=`,
    transactionList: `${url}/user/transactionList/`,

    mysubscription: `${url}/user/mySubscriptions`,
    mypurchases: `${url}/user/mypurchases`,
    mysales: `${url}/user/mysales`,
    delnft: `${url}/nft/nft/`,
    listorder: `${url}/order/listOrder`,
    ipfsupload: `${url}/nft/ipfsUpload`,
    subscribeNow: `${url}/user/subscribeNow/`,
    share: `${url}/user/shareWithAudience`,
    share2: `${url}/user/shareTheLesson`,
    editAudience: `${url}/user/editAudience`,
    uploadft: `${url}/nft/uploadNFT`,
    createNft: `${url}/nft/createNft`,
    nftList: `${url}/nft/nftList`,
    nft2List: `${url}/nft/nft2List`,
    myNftList: `${url}/nft/myNftList`,
    myNft1List: `${url}/nft/myNft1List`,
    myNft2List: `${url}/nft/myNft2List`,
    addNft: `${url}/nft/nft`,
    addNft1: `${url}/nft/nft1`,
    addNft2: `${url}/nft/nft2`,
    editNft: `${url}/nft/nft`,
    editNft2: `${url}/nft/nft2`,
    viewNft: `${url}/nft/viewNft/`,
    viewNft2: `${url}/nft/viewNft2/`,
    order: `${url}/order/order`,
    cancelOrder: `${url}/order/cancelOrder?_id=`,

    edit: `${url}/nft/nft`,
    del: `${url}/nft/nft`,
    placebid: `${url}/bid/bid`,
    getbid: `${url}/bid/bid`,
    myBid: `${url}/bid/myBid`,
    sublist: `${url}/user/subscriberList`,
    allorder: `${url}/order/allListOrder`,
    userlist: `${url}/user/userList`,
    orderwithid: `${url}/order/order/`,
    bids: `${url}/bid/bid/`,
    report: `${url}/user/reportNow/`,
    userlogin: `${url}/user/login`,
    sendOtpRegister: `${url}/user//sendOtpRegister`,
    register: `${url}/user/register`,
    forgotPassword: `${url}/user/forgotPassword/`,
    resetPassword: `${url}/user/resetPassword/`,
    Buy: `${url}/admin/Buy/`,
    buyPlan: `${url}/user/purchasePlan/`,
    price: `${url}/admin/price/`,
    getpublicPlans: `${url}/admin/getpublicPlans/`,
    bill: `${url}/user/bill/`,
    order: `${url}/user/order/`,


    withdraw: `${url}/blockchain/withdraw`,
    swap: `${url}/blockchain/swap`,
    sendOrderToUser: `${url}/order/sendOrderToUser`,
    soldOrderList: `${url}/order/soldOrderList`,
    buyOrderList: `${url}/order/buyOrderList`,
    auctionNftList: `${url}/order/auctionNftList`,
    auctionNft: `${url}/order/auctionNft/`,
    myAuctionNftList: `${url}/order/myAuctionNftList`,
    likeDislikeNft: `${url}/user/likeDislikeNft/`,
    likeDislikeNft1: `${url}/user/likeDislikeNft1/`,
    likeDislikeNft2: `${url}/user/likeDislikeNft2/`,
    donation: `${url}/user/donation`,
    listBid: `${url}/bid/listBid`,
    acceptBid: `${url}/bid/acceptBid`,
    userAllDetails: `${url}/user/userAllDetails/`,
    getUser: `${url}/user/getUser/`,
    getCertificates: `${url}/user/getCertificates`,
    listAllNft: `${url}/nft/listAllNft`,
    listAllNft1: `${url}/nft/listAllNft1`,
    listAllNft2: `${url}/nft/listAllNft2`,
    followProfile: `${url}/user/followProfile/`,
    profileFollowersList: `${url}/user/profileFollowersList`,
    profileFollowingList: `${url}/user/profileFollowingList`,
    donateUserList: `${url}/user/donateUserList`,

    chatList: `${url}/chat/list/`,
    initChat: `${url}/chat/init/`,
    viewChat: `${url}/chat/view/`,
    readChat: `${url}/chat/read/`,
    chatUploadImage: `${url}/chat/uploadFile/`,

    latestUserList: `${url}/user/latestUserList`,
    listFee: `${url}/admin/listFee`,
    readNotification: `${url}/notification/read`,
    markAllNotificationsRead: `${url}/notification/markAllRead`,
    removeNotification: `${url}/notification/remove`,
    likeDislikeUser: `${url}/user/likeDislikeUser/`,
    bundlePostList: `${url}/user/bundlePostList/`,
    bundleContentList: `${url}/user/bundleContentList`,
    courseContentList: `${url}/user/courseContentList`,
    allUserList: `${url}/user/allUserList`,
    exportNFT: `${url}/user/exportNFT`,
    totalEarnings: `${url}/user/totalEarnings`,
    listSocial: `${url}/admin/listSocial`,
    getBanner: `${url}/user/getBanner`,
    listBanner: `${url}/user/listBanner`,
    getBannerDuration: `${url}/user/getBannerDuration`,
    landingContentList: `${url}/content/landingContentList`,
    landingContent1List: `${url}/content1/landingContent1List`,
    staticSectionList: `${url}/content/staticContentList`,
    staticContentList: `${url}/static/staticContentList`,
    viewStaticPage: `${url}/static/staticContent`,

    story: `${url}/story/`,
    likeDislikeStory: `${url}/story/likeDislikeStory/`,
    getAllStories: `${url}/story/getAllStories/`,
    getSubscription: `${url}/user/getSubscription`
};

export default Apiconfigs;
