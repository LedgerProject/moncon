import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
const contractAddr = process.env.CONTRACT_ADDRESS
const tokenAddr = process.env.TOKEN_ADDRESS

export const approve = async (Contract,account) => {
  return Contract.methods
    .approve(contractAddr, ethers.constants.MaxUint256)
    .send({ from: account })
} 