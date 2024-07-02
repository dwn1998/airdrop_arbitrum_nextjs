import axios from 'axios';

const server = "http://127.0.0.1:2281";

export const postMessage = async (message) => {
  try {
    const response = await axios.post(`${server}/v1/messages`, { content: message });
    return response.data;
  } catch (error) {
    console.error('Error posting message to Hubble API:', error);
    throw error;
  }
};

export const postRecast = async (originalCastId, message) => {
  try {
    const response = await axios.post(`${server}/v1/recasts`, {
      originalCastId,
      content: message,
    });
    return response.data;
  } catch (error) {
    console.error('Error posting recast to Hubble API:', error);
    throw error;
  }
};

export const getMessagesByFid = async (fid, pageSize = 10, pageToken = '') => {
  try {
    const response = await axios.get(`${server}/v1/castsByFid`, {
      params: { fid, pageSize, pageToken }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages from Hubble API:', error);
    throw error;
  }
};
