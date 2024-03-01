import React, { useState} from "react";
import {ClipLoader} from 'react-spinners';
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';
import {BsEye} from 'react-icons/bs';

function LazyImageComponent(props) {
  const [isLoading, setIsLoading] = useState(true);
  let imgHeight;
  if(isLoading)
  if(window.innerWidth >= 1280)
    imgHeight=((window.innerWidth - 60)/4);
  else if(window.innerWidth >= 1024)
    imgHeight=((window.innerWidth - 48)/3);
  else if(window.innerWidth >= 640)
    imgHeight=((window.innerWidth - 36)/2);
  else
    imgHeight=((window.innerWidth - 24));
  return (
    <div className="w-full h-full relative token-image">
      <div className='absolute p-4 w-full h-full top-0 left-0 transition rounded-3xl deplay-[40] bg-black/70 opacity-0 hover:opacity-100 z-20 hidden md:flex flex-col justify-center items-center'>
          <div className='text-white text-center'>{props.des}</div>
          <BsEye className="text-white w-10 h-10"></BsEye>
      </div>
      
      {!isLoading ? null : (
        <div className="loading w-full rounded-3xl flex justify-center items-center p-3 border-2 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 background-animate" style={{height:imgHeight}}>
          <ClipLoader color="#000000" />
        </div>
      )}
      <LazyLoadImage
        style={isLoading?{display:'hidden'}:{display:'flex'}}
        className="rounded-3xl "
        placeholderSrc={props.back_url}
        src={props.background_url}
        effect="opacity"
        onLoad={()=>setIsLoading(false)}
      />
    </div>
  );
}

export default LazyImageComponent;
