import axios from 'axios';

const TOKEN = "cj81k81r01qkj2usuj90cj81k81r01qkj2usuj9g"

export default axios.create({
  baseURL:'https://finnhub.io/api/v1',
  params:{
    token:TOKEN
  }
})