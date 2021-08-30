import { useState, useEffect } from 'react';
import { Button, Grid, makeStyles, Snackbar } from '@material-ui/core';
import apiService from '../../Services/apiService';
import { abinft, abiMarketPlace } from "../../utils/abiHelpers";
import { getWeb3 } from "../../utils/web3Handler";
import NFTCard from "../NFTCard/NFTCard";
import moncon_negro from '../../Assets/Images/moncon_negro.png'
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
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
  buttonConnectContainer: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  buttonConnect: {
    borderRadius: 20,
    fontWeight: 900,
  },
  logoContainer: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
  },
  logo: {
    maxWidth: 160,
    marginLeft: 12,
    [theme.breakpoints.down('xs')]: {
      margin: '20px 0 10px',
    },
  },
  header: {
    marginBottom: 40,
  },
  errorMessage: {
    width: '80%',
    margin: '0 auto',
  },
}));

const NFTMarketplace = () => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [address, setAddress] = useState("0x000");
  const [update, setupdate] = useState(0);
  const [imagesMarket, setImagesMarket] = useState(null);
  const [prices, setPrices] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const time = async () => {
      if (isLoaded) {
        //await imagesLoader(address);
        await marketLoader(address);
      }
    };
    time();
    return () => { };
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
        setShowError(false);
        updateHandler()        
      } else {
        setShowError(true);
      }
    }, 600);
    return () => {
      clearInterval(time);
    };
  }, [isLoaded]);

  const updateHandler = () => {
    setupdate(update + 1);
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

    //setPrices
    const market = await marketPlaceInstance.methods
      .getAsks()
      .call();
    console.log(market);
    let response = [];
    let prices_ = [];

    if (market.length > 0) {
      response = market.map((item) => item.tokenId);
      prices_ = market.map((item) => (item.price));
      const marketHash = await contractInstance.methods
        .getAllHashBatch(response)
        .call();
      const urisHandler = await imageHandler(marketHash, response);
      setImagesMarket(urisHandler);
      setPrices(prices_);
    } else setImagesMarket(undefined);
  };

  const getTokenFromAPI = async (tokenId) => {
    return await apiService.get(`/nft/${tokenId}`)
      .then((response) => {
        //      console.log(response.data);
        return response.data;
      });
  }

  const handleConnectWallet = () => {
    console.log('CONNECT WALLET');
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} container justify="space-between" className={classes.header}>
          <Grid xs={12} sm={2} className={classes.logoContainer}>
            <img src={moncon_negro} className={classes.logo} alt="Moncon logo" />
          </Grid>
          <Grid xs={12} sm={4} lg={2} className={classes.buttonConnectContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonConnect}
              component="span" onClick={handleConnectWallet}
            >
              Connect your Wallet
            </Button>
          </Grid>
        </Grid>
        { showError && (
          <Grid xs={12}>
            <Alert severity="error" className={classes.errorMessage}>
              <AlertTitle>Error</AlertTitle>
              Verify if your Metamask wallet is connected
            </Alert>
          </Grid>
        )}
        {!!imagesMarket
          ? imagesMarket.map((image, i) => (
            <NFTCard
              key={i}
              image={image}
              className={classes.media}
              updateHandler={updateHandler}
              isMarketplace={true}
              price={prices[i]}
            />
          ))
          : null}
      </Grid>
    </>
  )
}

export default NFTMarketplace;
