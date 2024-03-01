import React, { useState,useEffect,useRef} from 'react';
import axios from 'axios'
import {useParams} from 'react-router-dom'
import LineChart from '../component/LineChart';
import {BsStarFill, BsStar, BsHeart, BsArrowLeftShort, BsArrowRightShort} from "react-icons/bs";
import {BounceLoader} from 'react-spinners'
import TwitterFeed from '../component/TwitterFeed';
import {BiChevronDownCircle} from 'react-icons/bi'
import {FaTwitter, FaTelegramPlane } from 'react-icons/fa';

import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import {db, storage,getTokenData} from '../firebase/firebase';
import {getDocs, collection, getDoc,} from 'firebase/firestore';
import {Link} from 'react-router-dom'

import HeaderLogo2 from "../assets/img/tokens/meme_match_navlogo.svg"
import back from "../assets/img/tokens/back2.png"
import dexLogo from "../assets/img/tokens/dextools.svg";
import twitterLogo from "../assets/img/tokens/cdnlogo.com_twitter-icon.svg";

function CoinOverview(props) {
    const { id } = useParams();
    const heart = require('../assets/img/tokens/Vector.png');
    const downPic = require('../assets/img/tokens/down.png');

    const [coinLists, setCoinLists] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);

    const [dexUrl, setDexUrl] = useState("");
    const [searchState, setSearchState] = useState(1);
    const [currentId, setCurrentId] = useState(-1);
    const [showModalFlag, setShowModalFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
        ///Connect Wallet
        // This code will be executed only once, similar to componentDidMount
        //this.interval = setInterval (() => this. fetchCurrencyData (), 60 *1000)   
        getCoinData(id,1);
        fetchData();
    }, []); 

    const fetchData = async () => {
      //get tokenlist data from firebase
      try {
        const querySnapshot = await getDocs(collection(db, "fl_content"));  
        const newData = await Promise.all(
            querySnapshot.docs.map((doc) => {
                return getTokenData(doc);
            })
        );
        setCoinLists(newData);
      } catch (error) {
          console.error(error);
      }
    };

    const getCoinData = async (coinID, period) => {
      if(currentId != coinID)
        setIsLoading(true);
      const toDate = (Date.now() / 1000).toFixed(0);
      const fromDate = toDate - period * 86400;
      const tokenTradingData = await axios.get(`https://api.dev.dex.guru/v1/tradingview/history?symbol=${coinID}-eth_USD&resolution=60&from=${fromDate}&to=${toDate}&currencyCode=USD&api-key=S5a8FMI9fWx7A9zOFFQV0_6qg7GcSg3ghAj_TWISkoc`);
      const tempData = await axios.get(`https://api.geckoterminal.com/api/v2/networks/eth/tokens/${coinID}?include=top_pools`);
      setDexUrl(tempData.data.included[0].id.slice(4, tempData.data.included[0].id.length));
      setHistoricalData(tokenTradingData.data);
      setCurrentId(coinID);
      setSearchState(period);
      setIsLoading(false);
    };

    let captionContent=[];
    let chartContent = [];
    let modalContent = [];

    if(coinLists != undefined)
    {
      for(var i = 0; i < coinLists.length; i ++)
      {
        if(coinLists[i].data.address == currentId)
        {
          const prevId = i>0?coinLists[i-1].data.address:coinLists[coinLists.length-1].data.address;
          const nextId = i<(coinLists.length-1)?coinLists[i+1].data.address:coinLists[0].data.address;
          let starContent=[];
          for(var j = 0 ; j < 5; j ++){
              starContent = [...starContent, (
                <BsStarFill className='text-purple-500'/>
              )];
          }
          captionContent = (
            <div className='w-full h-[150px] md:h-[400px] overflow-hidden relative'>
              {/* <img className='absolute w-full h-full z-0' src={coinLists[i].wallpaper_url}></img> */}
              <div className='w-full z-0 token-background h-full relative'>
                <LazyLoadImage className='w-[640px] lg:w-full' placeholderSrc={back} src={coinLists[i].wallpaper_url} effect="blur"/>
              </div>
              <div className='absolute w-full h-full flex justify-between items-center top-0'>
              <button className='hidden md:flex ml-5 w-10 h-10 bg-white rounded-full transition delay-[40] hover:bg-gray-400 hover:text-white z-10 relative justify-center items-center' onClick={()=>{getCoinData(prevId,1)}}>
                  <BsArrowLeftShort className='w-8 h-8'/>
              </button>
              <div className='flex md:hidden h-full items-start py-3'>
                <Link to="/coinlists" className='ml-3 w-10 h-10 flex bg-white rounded-full transition delay-[40] hover:bg-gray-400 hover:text-white z-10 relative justify-center items-center'>
                    <BsArrowLeftShort className='w-8 h-8'/>
                </Link>
              </div>
              <div className='flex flex-col relative h-full justify-end md:justify-center items-center space-y-3 sm:space-y-10 py-2'>
                  <div className='flex flex-col items-center space-y-2 mt-0 md:mt-20'>
                     <div className=''><img src={coinLists[i].logo_url} className='w-16 sm:w-20 h-16 sm:h-20 rounded-2xl'></img></div>
                    <div className='text-2xl md:text-5xl text-white font-Lalezar'>{coinLists[i].symbol.toUpperCase()}</div>
                  </div>
                  <button className='w-10 h-10 text-black bg-white rounded-full hidden md:flex justify-center items-center transition delay-[40] hover:bg-red-500 hover:text-white'><BsHeart/></button>
              </div>
              <button className='hidden md:flex mr-5 w-10 h-10 bg-white rounded-full transition delay-[40] hover:bg-gray-400 hover:text-white z-10 relative  justify-center items-center' onClick={()=>{getCoinData(nextId,1)}}>
                <BsArrowRightShort className='w-8 h-8'/>
              </button>
              <div className='flex md:hidden h-full items-start py-3'>
                <button className='w-10 h-10 mr-3  text-black bg-white rounded-full flex justify-center items-center transition delay-[40] hover:bg-red-500 hover:text-white'><BsHeart/></button>
              </div>
              </div>
            </div>
          );
          const twitterUrl = coinLists[i].twitterUrl.split('/');
          let market_cap_change_rate = ((historicalData.c[historicalData.c.length - 1] - historicalData.c[0])/historicalData.c[0] * 100);
          let decimalCnt = 0;
          let tmp = coinLists[i].data.token_supply / coinLists[i].data.liquidity_usd;
          while(tmp >= 1){
            tmp /= 10;
            decimalCnt ++;
          }
          decimalCnt += 2;
          chartContent = (
          <div className='w-full flex flex-col lg:grid lg:grid-cols-9'>
              <div className='col-span-6 py-2 md:py-4 h-[70vh] md:h-full'>
                <div className='text-2xl sm:text-5xl text-center flex justify-between pl-2 pr-2 md:pr-6 md:pl-6 lg:pl-12 font-Lalezar'>
                  <div>{"$" + (coinLists[i].data.price_usd * coinLists[i].data.token_supply).toLocaleString()}</div>
                  <div className='flex space-x-2 items-center'>
                    <a href={"https://www.dextools.io/app/en/ether/pair-explorer/" + dexUrl} target="blank">
                      <img className='w-6 sm:w-10 h-6 sm:h-10' src={dexLogo}/>
                    </a>
                    <a href={coinLists[i].telegramUrl} target="blank">
                      <img className='w-6 sm:w-10 h-6 sm:h-10' src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"/>
                    </a>
                    <a href={coinLists[i].twitterUrl} target="blank">
                      <img className='w-6 sm:w-10 h-6 sm:h-10' src={twitterLogo}/>
                    </a>
                  </div>
                </div>
                <div className='flex pl-2 pr-2 md:pl-6 md:pr-6 lg:pl-12 py-1 md:py-4 md:space-x-10 font-bold justify-between md:justify-start'>
                  {searchState == 1?
                      (<button className='px-2 py-1 text-gray-900 text-xs sm:text-lg rounded-lg font-Inter'>Today</button>):
                      (<button className='px-2 py-1 cursor-pointer text-gray-500 text-xs sm:text-lg transition delay-[40] hover:text-gray-900 font-Inter' onClick={()=>{getCoinData(currentId, 1)}}>Today</button>)
                  }
                  {searchState == 7?
                      (<button className='px-2 py-1 text-gray-900 text-xs sm:text-lg rounded-lg'>7 days</button>):
                      (<button className='px-2 py-1 cursor-pointer text-gray-500 text-xs sm:text-lg transition delay-[40] hover:text-gray-900 font-Inter' onClick={()=>{getCoinData(currentId, 7)}}>7 days</button>)
                  }
                  {searchState == 14?
                      (<button className='px-2 py-1 text-gray-900 text-xs sm:text-lg rounded-lg font-Inter'>14 days</button>):
                      (<button className='px-2 py-1 cursor-pointer text-gray-500 text-xs sm:text-lg transition delay-[40] hover:text-gray-900 font-Inter' onClick={()=>{getCoinData(currentId, 14)}}>14 days</button>)
                  }
                  {market_cap_change_rate<0?
                    (<div className='ml-2 px-3 py-2 bg-[#D8494A] text-white text-sm rounded-xl flex items-center space-x-1 self-end'>
                        <img src={downPic} className='w-2 h-2 rotate'></img>
                        <div className='font-bold text-white text-xs sm:text-sm font-Inter'>{market_cap_change_rate.toFixed(2)+"%"}</div>
                    </div>):
                    (<div className='ml-2 px-3 py-2  bg-teal-500 text-white text-sm rounded-xl flex items-center space-x-1 self-end'>
                        <img src={downPic} className='w-2 h-2 rotate-180'></img>
                        <div className='font-bold text-white text-xs sm:text-sm font-Inter'>{market_cap_change_rate.toFixed(2)+"%"}</div>
                    </div>)}
                </div>
                <div className="pb-24 md:pb-0 pl-0 lg:pl-12">
                   <LineChart historicalData={historicalData} decimalCnt={decimalCnt}></LineChart>
                   <div className='w-full block lg:hidden'>
                    <TwitterFeed isPc={false} coinDetail={twitterUrl[twitterUrl.length - 1]}></TwitterFeed>
                   </div>
                </div>
                <div className=' px-4  md:px-10 hidden lg:flex lg:flex-row space-x-2 w-full justify-center'>
                  {starContent}
                </div>
              </div>
              <div className='col-span-3 py-0 md:py-5 pl-2 pr-2 md:pr-0 md:pl-5 bg-white fixed bottom-0 w-full md:relative flex flex-col space-y-2 md:space-y-0'>
                <div className='flex flex-row lg:hidden space-x-2 w-full justify-center'>
                  {starContent}
                </div>
                <div className='px-2 py-2'><button className='py-2 bg-purple-600 text-white text-lg rounded-lg w-full hover:bg-purple-800' onClick={()=>{
                    setShowModalFlag(true);
                }}>Invest</button></div>
                <div className='w-full hidden lg:block px-2'>
                   <TwitterFeed isPc={false} coinDetail={twitterUrl[twitterUrl.length - 1]}></TwitterFeed>
                   </div>
              </div>
          </div>);

          modalContent = (
            <div className='fixed top-0 w-full h-full z-30 flex justify-center items-end lg:items-center transition delay-[40]'>
              <div className='w-full h-full bg-black/30 ' onClick={()=>{setShowModalFlag(false)}}></div>
                <div className='fadeup absolute transition delay-[40] w-full lg:w-[450px]  h-full max-h-[750px] bg-white px-5 py-4 rounded-t-2xl rounded-b-none lg:rounded-b-2xl flex flex-col items-center justify-center space-y-2 z-40 overflow-y-auto'>
                  <div className='w-full flex flex-row justify-end'><BiChevronDownCircle className='w-8 h-8 cursor-pointer' onClick={()=>{setShowModalFlag(false)}}></BiChevronDownCircle></div>
                  <iframe className="w-full h-full" frameborder="0" allow="clipboard-read *; clipboard-write *; web-share *; accelerometer *; autoplay *; camera *; gyroscope *; payment *; geolocation *"
                    src={`https://flooz.xyz/embed/trade?swapDisabled=false&swapToTokenAddress=${currentId}&swapLockToToken=true&onRampDisabled=false&onRampAsDefault=false&onRampDefaultAmount=20&onRampTokenAddress=eth&onRampLockToken=true&stakeDisabled=true&network=eth&lightMode=true&primaryColor=%235e38f4&backgroundColor=transparent&roundedCorners=10&padding=22&refId=96VUv9`} >
                  </iframe>
                </div>
            </div>
          );
        }
      }
    }
    return (
    
      <div className="relative">
        {isLoading?(<div className='w-full h-[100vh] flex justify-center items-center'><BounceLoader className='self-center' color="#6D28D9"/></div>):(
          <div className='bg-white'>
            <div className='fixed w-full px-6 py-6 bg-violet-700/80 md:flex md:flex-col justify-center items-center gap-4 hidden z-30'>
              <div className='text-lg md:text-2xl text-white font-bold flex gap-2 items-center'>
                <img src={HeaderLogo2} className='w-40 md:w-60'></img>
              </div>
            </div>
            {captionContent}
            {chartContent}
            {showModalFlag?modalContent:""}
          </div>
        )}         
      </div>
    );
  }
  
  export default CoinOverview;
