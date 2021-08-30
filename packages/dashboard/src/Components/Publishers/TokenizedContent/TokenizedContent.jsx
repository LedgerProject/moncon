import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  createMuiTheme,
  Grid,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { isValidURL } from "../../../Services/contentsService";
import { abinft, abiMarketPlace } from "../../../utils/abiHelpers";
import { getWeb3 } from "../../../utils/web3Handler";
import apiService from "../../../Services/apiService";
import NFTCard from "../../NFTCard/NFTCard";

const useStyles = makeStyles(() => ({
  containerAddUrl: {
    padding: 20,
    marginBottom: 30,
  },
  media: {
    height: 400,
  },
  buttonAdd: {
    marginTop: 20,
  },
}));

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#fff",
    },
    secondary: {
      main: "#1c1c1c",
    },
    background: {
      paper: "#1c1c1c",
    },
  },
});

const TokenizedContent = () => {
  const classes = useStyles();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [images, setImages] = useState(null);
  const [imagesMarket, setImagesMarket] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);  
  const [address, setAddress] = useState("0x000");
  const [update, setupdate] = useState(0);

  useEffect(() => {
    const time = async () => {
      if (isLoaded) {
        await imagesLoader(address);
        await marketLoader(address);
      }
    };
    time();
    return () => {};
  }, [update]);

  //load
  useEffect(() => {
    const time = setInterval(async () => {
      if (window.ethereum || window.web3) {
        const web3IsLoad = await getWeb3();
        if (web3IsLoad != undefined) {
          setIsLoaded(true);
          clearInterval(time);
        }
      }
    }, 200);

    return () => {
      clearInterval(time);
    };
  }, []);
  // change
  useEffect(() => {
    const time = setTimeout(async () => {
      if (isLoaded) {
        let accounts = await window.web3.eth.getAccounts();
        window.ethereum.on("accountsChanged", async () => {
          //On change Address
          let accounts = await window.web3.eth.getAccounts();
          setAddress(accounts[0]);
          console.log(`Account changed: ${accounts[0]}`);
        });
        window.ethereum.on("disconnect", () => {
          //On disconect
          console.log("disconnect");
        });
        setAddress(accounts[0]);

        clearInterval(time);
      }
    }, 600);
    return () => {
      clearInterval(time);
    };
  }, [isLoaded]);

  useEffect(() => {
    const time = setTimeout(async () => {
      if (!isLoaded) return;
      updateHandler();
    });
    return () => {
      clearTimeout(time);
    };
  }, [address]);

  const updateHandler = () => {
    setupdate(update + 1);
  };

  const createTokenInAPI = async () => {
    const body = {
      name: newName,
      description: newDescription,
      image: newUrl,
    };
    return apiService.post("/nft", body).then((response) => {
      //console.log(response.data);
      return response.data.url;
    });
  };

  const getTokenFromAPI = async (hash) => {
    return await apiService.get(`/nft/${hash}`).then((response) => {
      //      console.log(response.data);
      return response.data;
    });
  };
  
  const marketLoader = async () => {
    const contractInstance = await new window.web3.eth.Contract(
      abinft,
      process.env.REACT_APP_NFT_ADDRESS
    );
    let accounts = await window.web3.eth.getAccounts();
    const marketPlaceInstance = await new window.web3.eth.Contract(
      abiMarketPlace,
      process.env.REACT_APP_MARKETPLACE_ADDRESS
    );
    const market = await marketPlaceInstance.methods
      .getAsksByUser(accounts[0])
      .call();
    let response = [];
    if (market.length > 0) {
      response = market.map((item) => item.tokenId);
      const marketHash = await contractInstance.methods
        .getAllHashBatch(response)
        .call();
      const urisHandler = await imageHandler(marketHash, response);
      setImagesMarket(urisHandler);
    } else setImagesMarket(undefined);
  };

  const imageHandler = async (hashs, tokenIDs) => {
    return Promise.all(
      hashs.map(async (hash, index) => {
        const response = await getTokenFromAPI(hash);
        return {
          img: response.image,
          title: response.name,
          description: response.description,
          tokenId: tokenIDs[index],
        };
      })
    );
  };

  const imagesLoader = async (address) => {
    const contractInstance = await new window.web3.eth.Contract(
      abinft,
      process.env.REACT_APP_NFT_ADDRESS
    );

    let accounts = await window.web3.eth.getAccounts();
    const hashs = await contractInstance.methods.getAllHash(accounts[0]).call();
    const tokenIDs = await contractInstance.methods
      .getAllTokenId(accounts[0])
      .call();
    const urisHandler = await imageHandler(hashs, tokenIDs);
    if (tokenIDs.length > 0) setImages(urisHandler);
    else setImages(undefined);
  };
  const handleAddToken = async () => {
    if (!isValidURL(newUrl)) return alert("Invalid URL");
    if (!isLoaded) {
      alert("Wallet not connected");
      return;
    }
    const hashAPI = await createTokenInAPI();

    let hash = hashAPI.split("/");
    hash = hash[hash.length - 1];
    alert("wait for confirmation");

    try {
      const contractInstance = await new window.web3.eth.Contract(
        abinft,
        process.env.REACT_APP_NFT_ADDRESS
      );
      await contractInstance.methods
        .safeMint(address, hash)
        .send({
          from: address,
        })
        .on("transactionHash", function (hash_) {
          console.log(hash_);
        })
        .on("receipt", async function (receipt) {
          updateHandler();
        })
        .on("error", function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error);
          alert("Transaction declined");
        });

      setNewUrl("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs>
          <ThemeProvider theme={theme}>
            <Paper>
              <Grid
                container
                alignItems="center"
                className={classes.containerAddUrl}
              >
                <Grid item xs={3}>
                  <Typography variant="h5">Tokenize your image</Typography>
                </Grid>
                <Grid item xs={12} mb={2}>
                  <TextField
                    label="Name"
                    value={newName}
                    fullWidth
                    onChange={(event) => setNewName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={newDescription}
                    fullWidth
                    onChange={(event) => setNewDescription(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} mb={4}>
                  <TextField
                    label="Image URL"
                    value={newUrl}
                    fullWidth
                    onChange={(event) => setNewUrl(event.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Grid container>
                    <Button
                      variant="contained"
                      component="span"
                      disabled={
                        !newName.length ||
                        !newDescription.length ||
                        !newUrl.length
                      }
                      onClick={() => handleAddToken()}
                      className={classes.buttonAdd}
                    >
                      CREATE
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </ThemeProvider>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {!!images
          ? images.map((image, i) => (
              <NFTCard
                key={i}
                image={image}
                className={classes.media}
                updateHandler={updateHandler}
              />
            ))
          : null}
        {!!imagesMarket
          ? imagesMarket.map((image, i) => (
              <NFTCard
                key={i}
                image={image}
                className={classes.media}
                isMarketCard={true}
                updateHandler={updateHandler}
              />
            ))
          : null}
      </Grid>
    </>
  );
};

export default TokenizedContent;
