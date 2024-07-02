'use client'
import React, { useState } from 'react';
import { ethers } from 'ethers';
import styles from './MintTokenFrame.module.css';

const contractAddress = '0x4993e66c23615b5DEf6D02b2a0A0ea142DCBd379';
const contractABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dailyMintedAmount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DAILY_MINT_LIMIT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkDailyMintLimit",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

const generateWarpcastURL = (text, embeds = []) => {
  let url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
  embeds.forEach(embed => {
    url += `&embeds[]=${encodeURIComponent(embed)}`;
  });
  return url;
};

const MintTokenFrame = () => {
  const [imageSrc, setImageSrc] = useState('got1.png');
  const [canMint, setCanMint] = useState(false);
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(false);

  const appUrl = "https://airdrop-arbitrum-nextjs.vercel.app/";

  const checkAirdrop = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      try {
        const isMintable = await contract.checkDailyMintLimit();
        if (isMintable) {
          setImageSrc('got2.png');
          setCanMint(true);
        } else {
          setImageSrc('got_fail_exceed.png');
        }
      } catch (error) {
        console.error('Error checking airdrop:', error);
      }
    } else {
      alert('Please install MetaMask to check airdrop.');
    }
  };

  const handleRecastAndClaim = () => {
    const text = `I am claiming my airdrop on MintableToken! Check it out: ${appUrl}`;
    const url = generateWarpcastURL(text);
    window.open(url, '_blank');
    setShared(true);
    setImageSrc('got2_claim.png');
  };

  const handleShareFrame = () => {
    const text = `Sharing my MintableToken frame! Check it out: ${appUrl}`;
    const url = generateWarpcastURL(text);
    window.open(url, '_blank');
    setShared(true);
  };

  const mintToken = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask to mint tokens.');
    }
  };

  return (
    <div className={styles.container}>
      <img src={`/${imageSrc}`} alt="Mint Token" className={styles.mainImage} />
      {!canMint && (
        <button onClick={checkAirdrop} className={styles.mintButton} disabled={loading}>
          {loading ? 'Checking...' : 'Check Airdrop'}
        </button>
      )}
      {canMint && !shared && imageSrc === 'got2.png' && (
        <button onClick={handleRecastAndClaim} className={styles.mintButton} disabled={loading}>
          Recast & Claim
        </button>
      )}
      {canMint && shared && imageSrc === 'got2_claim.png' && (
        <button onClick={mintToken} className={styles.mintButton} disabled={loading}>
          Claim
        </button>
      )}
      {(imageSrc === 'got_fail_exceed.png' || imageSrc === 'got_fail_repeat.png' || imageSrc === 'got_success.png') && (
        <button onClick={handleShareFrame} className={styles.mintButton} disabled={loading}>
          Share Frame
        </button>
      )}
    </div>
  );
};

export default MintTokenFrame;
