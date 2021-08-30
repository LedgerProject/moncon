import React, { useEffect, useState } from "react";
import SellDialog from './SellDialog'
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
import { abinft, abiMarketPlace } from '../../utils/abiHelpers';

const useStyles = makeStyles((theme) => ({
  buyButton: {
    borderRadius: 20,
    width: 90,
    fontWeight: 900,
  },
  priceLabel: {
    fontWeight: 900,
    color: '#000',
    float: 'right',
    marginRight: 20,
  },
}));

const NFTCard = ({ image, updateHandler, isMarketCard, className, isMarketplace, price }) => {
  const classes = useStyles();
  const [itemPrice, setItemPrice] = useState(0);
  const [isWrap, setIsWrap] = useState(true);

  useEffect(() => {
    if (price != undefined) {
      setItemPrice(window.web3.utils.fromWei(price));
    }
  }, [price]);

  const approve = (contractInstance) => {
    return new Promise(async (resolve, reject) => {
      let accounts = await window.web3.eth.getAccounts();
      await contractInstance.methods
        .setApprovalForAll(process.env.REACT_APP_MARKETPLACE_ADDRESS,
          true).send({
            from: accounts[0]
          }).on("transactionHash", function (hash_) {
            console.log(hash_);
          })
        .on("receipt", async function (receipt) {
          resolve(true);
        })
        .on("error", function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error);
          resolve(false);
        });
    })
  }

  const sellTokenHandler = async (id, prices) => {
    try {
      const contractInstance = await new window.web3.eth.Contract(
        abiMarketPlace,
        process.env.REACT_APP_MARKETPLACE_ADDRESS
      );
      let accounts = await window.web3.eth.getAccounts();
      await contractInstance.methods
        .readyToSellToken(id,
          prices).send({
            from: accounts[0]
          }).on("transactionHash", function (hash_) {
            console.log(hash_);
          })
        .on("receipt", async function (receipt) {
          await updateHandler();
        })
        .on("error", function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error);
          alert("Transaction declined")
        });;

    } catch (e) {
      console.log(e);
    }

  }

  const sellToken = async (prices) => {
    const tokenId = image.tokenId
    try {
      const contractInstance = await new window.web3.eth.Contract(
        abinft,
        process.env.REACT_APP_NFT_ADDRESS
      );
      let accounts = await window.web3.eth.getAccounts();
      const isApprove = await contractInstance.methods.isApprovedForAll(accounts[0], process.env.REACT_APP_MARKETPLACE_ADDRESS).call();
      const newPrices = window.web3.utils.toWei(prices)
      if (isApprove) {
        await sellTokenHandler(tokenId, newPrices)
      }
      else {
        if (await approve(contractInstance))
          await sellTokenHandler(tokenId, newPrices)
        else
          throw ('approve fail')
      }
    } catch (e) {
      console.log(e);
      alert("Error")
    }
  }

  const cancelSellToken = async () => {
    const tokenId = image.tokenId
    try {
      const marketPlaceInstance = await new window.web3.eth.Contract(
        abiMarketPlace,
        process.env.REACT_APP_MARKETPLACE_ADDRESS
      );
      let accounts = await window.web3.eth.getAccounts();

      marketPlaceInstance.methods.cancelSellToken(tokenId)
        .send({
          from: accounts[0]
        }).on("transactionHash", function (hash_) {
          console.log(hash_);
        })
        .on("receipt", async function (receipt) {
          await updateHandler();
        })
        .on("error", function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error);
        });

    } catch (e) {
      console.log(e);
      alert("Error")
    }
  }

  const buyToken = async () => {
    const tokenId = image.tokenId
    try {
      const marketPlaceInstance = await new window.web3.eth.Contract(
        abiMarketPlace,
        process.env.REACT_APP_MARKETPLACE_ADDRESS
      );
      let accounts = await window.web3.eth.getAccounts();

      marketPlaceInstance.methods.buyToken(tokenId)
        .send({
          from: accounts[0],
          value: price

        }).on("transactionHash", function (hash_) {
          console.log(hash_);
        })
        .on("receipt", async function (receipt) {
          await updateHandler();
        })
        .on("error", function (error, receipt) {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          console.log(error);
        });

    } catch (e) {
      console.log(e);
      alert("Error")
    }
  }

  return (
    <Grid item xs={12} sm={6} md={4} >
      <Card elevation={3}>
        <CardActionArea>
          <CardMedia
            className={className}
            image={image.img}
            title={image.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {image.title}{" "}
              <Typography color="textSecondary" variant="h6" display="inline">
                #{image.tokenId}
              </Typography>
            </Typography>
            <Typography variant="body2" color="textSecondary"
            onMouseEnter={(e)=>
            {
              setIsWrap(false);
            }}
            onMouseLeave={(e)=>
              {
                setIsWrap(true);
              }}
            noWrap={isWrap}
            component="p">
              {image.description}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {!isMarketplace ? 
          (!isMarketCard ? <SellDialog sellToken={sellToken} />:null):
            <Grid container justify="space-between">
              <Grid item xs={2}>
                <Button variant="contained" size="small" color="primary" onClick={buyToken} className={classes.buyButton}>
                  BUY
              </Button>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="textSecondary" className={classes.priceLabel}>
                  {itemPrice} <span>BNB</span>
                </Typography>
              </Grid>
            </Grid>
          }
          {isMarketCard ?
            <Button variant="outlined" size="small" color="primary"
              onClick={cancelSellToken}
            >
              Order remove
      </Button> : null}
        </CardActions>
      </Card>
    </Grid>
  );
};

export default NFTCard;
