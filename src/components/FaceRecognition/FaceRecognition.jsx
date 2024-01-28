import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) => {
  if(imageUrl) {
    console.log(box.topRow)
    return (
      <div className='center ma'>
        <div className='absolute mt2'>
          <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
          <div className='bounding-box' style={{top: `${box.topRow}px`, right: `${box.rightCol}px`, left: `${box.leftCol}px`, bottom: `${box.bottomRow}px`}}></div>
        </div>
      </div>
    );
  } else {
    return null; // Render nothing if imageUrl is falsy
  }
}

export default FaceRecognition;
