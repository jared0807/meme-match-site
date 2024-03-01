import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import HeaderLogo1 from "../assets/img/tokens/memematch_splashlogo.svg";

function MainPage() {
  let navigate = useNavigate();
  useEffect(() => {
    //move to coinList Page after displaying the splash 3 seconds
    setTimeout(() => {
      navigate("/coinLists");
    }, 3 * 1000);
  }, []);
  return (
    <div className=" bg-violet-700 w-full p-2 h-[100vh] flex flex-col items-center justify-center">
      <div className="w-full sm:w-[500px] flex flex-col items-center justify-center space-y-6">
        <img src={HeaderLogo1} />
        <div className="text-lg text-center text-white">
          The meme coin exchange
        </div>
        {/* <div className='text-lg text-white text-center'>
               This is the best place to find and invest in established meme tokens to follow or invest in.
            </div>
            <div className=' text-white text-lg p-5 w-64 flex-col flex space-y-4'>
               <div className='flex items-center space-x-4'> <div className='w-4 h-4 bg-white rounded-full'></div><span className=''>Active communities</span></div>
               <div className='flex items-center space-x-4'> <div className='w-4 h-4 bg-white rounded-full'></div><span className=''>Locked liquidity</span></div>
               <div className='flex items-center space-x-4'> <div className='w-4 h-4 bg-white rounded-full'></div><span className=''>Contracts renounced</span></div>
            </div>
            <div className=''>
               <Link to="/coinlists" className='px-6 py-4 bg-white rounded-lg transition delay-[30] border-2 border-bg-violet-800/0 hover:bg-violet-800 hover:text-white hover:border-bg-violet-800/100 active:bg-white'>Enter | Register in future</Link>
            </div>
            <div className='text-white text-lg text-center'>
               By entering i agree to terms & conditions
            </div> */}
      </div>
    </div>
  );
}

export default MainPage;
