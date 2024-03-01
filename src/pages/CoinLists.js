import React,  { useState,useEffect,useRef} from 'react';
import {Link} from 'react-router-dom';

import {db, getTokenData} from '../firebase/firebase';
import {getDocs, collection, getDoc,} from 'firebase/firestore';

import {BounceLoader} from 'react-spinners';
import LazyImageComponent from "../component/LazyImageComponent";




function CoinLists() {
    const downPic = require('../assets/img/tokens/down.png');
    const HeaderLogo2 = require("../assets/img/tokens/meme_match_navlogo.svg");
    const back = require("../assets/img/tokens/back1.png");

    const [isLoading, setIsLoading] = useState(true);
    const [coinLists, setCoinLists] = useState(undefined);
    const [tmpLists, setTmpLists] = useState(null);
    const [sortType, setSortType] = useState(0);
    const [sortDown, setSortDown] = useState(true);
    


    useEffect(() => {
        fetchData(sortType, sortDown);
    }, [sortType, sortDown]);

    //Get the coinlists from firebase
    const fetchData = async (st, sd) => {
        setIsLoading(true);
        try {
            if(tmpLists == null)
            {
                const querySnapshot = await getDocs(collection(db, "fl_content"));  
                const newData = await Promise.all(
                    querySnapshot.docs.map((doc) => {
                        return getTokenData(doc);
                    })
                );
                setTmpLists(newData);
                setCoinLists(newData);
            }
            else
            {
                const sortData = [].concat(tmpLists)
                .sort((a, b) => {
                    //Sort by market_cap
                    if(sortType == 1) {
                        if(sortDown == false) {
                            return a.data.price_usd * a.data.token_supply> b.data.price_usd * b.data.token_supply ? 1 : -1;
                        }
                        else {
                            return a.data.price_usd * a.data.token_supply> b.data.price_usd * b.data.token_supply ? -1 : 1;
                        }
                    }
                });    
                setCoinLists(sortData);
            }
        } catch (error) {
            console.error(error);
        } 
        setIsLoading(false);
    };
 
    function changeSortType(n){
        fetchData(n, sortDown)
        setSortType(n);
    }

    function changeSortDown(){
        fetchData(sortType,!sortDown);
        setSortDown(!sortDown);
    }

    function divMouseDown(e) {
        if((e.clientX + 7) >= e.target.clientWidth) return;
    }

    let coinlistsTable = [];
    if(coinLists != undefined)
    { 
        coinlistsTable = coinLists.map((item)=>(
            <Link to={`/coinoverview/${item.data.address}`} className='col-span-1 relative cursor-pointer animeFadeShow'>     
                <div className='w-full relative'>
                    <LazyImageComponent className="rounded-2xl" back_url={back} background_url={item.background_url} des={item.description}/>
                    <div className='absolute left-0 top-5 w-[100%] px-4 flex flex-row justify-between'>
                        <img className='w-[25%] h-full rounded-lg' src={item.logo_url}></img>
                        <div className='flex flex-col'>
                            <div className=' text-white text-3xl sm:text-4xl font-Lalezar text-right'>${(item.data.price_usd * item.data.token_supply)>1000000?(((item.data.price_usd * item.data.token_supply)/1000000).toFixed(2) + "M"):(((item.data.price_usd * item.data.token_supply)/1000).toFixed(2) + "K")}</div>
                            {item.data.price_24h_delta_usd<0?
                            (<div className='mt-2 px-3 py-2 w-20 bg-[#D8494A] text-white text-sm rounded-xl flex items-center space-x-1 self-end'>
                                <img src={downPic} className='w-2 h-2 rotate'></img>
                                <div className='text-white text-xs sm:text-sm'>{item.data.price_24h_delta_usd.toFixed(2)+"%"}</div>
                            </div>):
                            (<div className='mt-2 px-3 py-2 w-20  bg-teal-500 text-white text-sm rounded-xl flex items-center space-x-1 self-end'>
                                <img src={downPic} className='w-2 h-2 rotate-180'></img>
                                <div className='font-bold text-center text-white text-sm'>{item.data.price_24h_delta_usd.toFixed(2)+"%"}</div>
                            </div>)}
                        </div>
                    </div>
                    <div className='absolute left-0 bottom-5 w-[100%] px-4 flex flex-row justify-start items-start'>
                        <div className='text-xl sm:text-2xl text-white text-left font-Lalezar'>{item.symbol.toUpperCase()}<br/>{item.name}</div>
                    </div>
                </div>  
            </Link>
        ));
    }
    return (
      <div className="w-full">
        <div className='w-full'>
            <div className='fixed w-full py-[14px] lg:py-[50px] bg-violet-700 flex flex-col justify-center items-center gap-4 z-50'>
                {/* <div className='text-2xl lg:text-5xl text-white flex gap-2 lg:gap-4 items-center font-Lalezar'><div>Meme</div><img src={heart} className='w-6 h-6 lg:w-full lg:h-full'></img><div>Match</div></div> */}
                <img src={HeaderLogo2} className='w-40 lg:w-60'></img>
            </div>
            <div className='h-full whitespace-nowrappb-3' onMouseDown={divMouseDown} bg-white>
                <div className='w-full p-7 lg:p-16'></div>
                <div className='w-full flex justify-center p-5 lg:p-10'>
                    <div className='bg-gray-100 border-2 border-gray-200/80 rounded-full flex'>
                        {(sortType==1)?(<div className='px-6 py-3 flex items-center text-sm sm:text-lg rounded-full bg-violet-700 text-white gap-1 cursor-pointer' onClick={changeSortDown}>
                        Price {sortDown?(<img src={downPic} className='w-[10px] h-[10px]'></img>):(<img src={downPic} className='rotate-180 w-[10px] h-[10px]'></img>)}
                        </div>):(<div className='px-6 py-3 flex items-center text-sm sm:text-lg rounded-full text-gray-400 cursor-pointer font-Inter' onClick={()=>changeSortType(1)}>Price</div>)}

                        {(sortType==2)?(<div className='px-6 py-3 flex items-center text-sm sm:text-lg rounded-full bg-violet-700 text-white gap-1 cursor-pointer' onClick={changeSortDown}>
                        Age {sortDown?(<img src={downPic} className='w-[10px] h-[10px]'></img>):(<img src={downPic} className='rotate-180 w-[10px] h-[10px]'></img>)}
                        </div>):(<div className='px-6 py-3 flex items-center text-sm sm:text-lg rounded-full text-gray-400 cursor-pointer font-Inter' onClick={()=>changeSortType(2)}>Age</div>)}

                        {(sortType==3)?(<div className='px-6 py-3 flex items-center text-sm sm:text-lg rounded-full bg-violet-700 text-white gap-1 cursor-pointer' onClick={changeSortDown}>
                        Rating {sortDown?(<img src={downPic} className='w-[10px] h-[10px]'></img>):(<img src={downPic} className='rotate-180 w-[10px] h-[10px]'></img>)}
                        </div>):(<div className='px-6 py-3 flex items-center text-sm sm:text-lg rounded-full text-gray-400 cursor-pointer font-Inter' onClick={()=>changeSortType(3)}>Rating</div>)}
                    </div>
                </div>         
                <div className='w-full'>
                    <div className='flex justify-center px-3'>
                        {isLoading?(<div className='w-full mt-[200px] flex justify-center items-center'><BounceLoader className='self-center' color="#6D28D9"/></div>):(
                        <div className='grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>{coinlistsTable}</div>)}
                    </div>
                </div>
                <div className='w-full p-2'></div>
            </div>
        </div>         
      </div>
    );
  }
  
  export default CoinLists;
