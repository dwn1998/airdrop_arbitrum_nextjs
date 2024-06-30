'use client'
import React, { useState } from 'react';
import { ethers } from 'ethers';
import styles from './MintTokenFrame.module.css';

const contractAddress = '0x959f76f01390Bf291bac1b1cf27477CE07728216';
const contractABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const MintTokenFrame = () => {
  const [imageSrc, setImageSrc] = useState('got1.png');

  const mintToken = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      try {
        const tx = await contract.mint();
        await tx.wait();
        setImageSrc('got_success.png');
      } catch (error) {
        if (error.message.includes('already minted')) {
          setImageSrc('got_fail_repeat.png');
        } else if (error.message.includes('exceeds the daily limit')) {
          setImageSrc('got_fail_exceed.png');
        } else {
          console.error('Error minting token:', error);
        }
      }
    } else {
      alert('Please install MetaMask to mint tokens.');
    }
  };

  return (
    <div className={styles.container}>
      <img src={`/${imageSrc}`} alt="Mint Token" className={styles.mainImage} />
      <button onClick={mintToken} className={styles.mintButton}>
        Mint Token
      </button>
    </div>
  );
};

export default MintTokenFrame;
