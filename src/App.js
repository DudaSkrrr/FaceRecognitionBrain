import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import { useState } from 'react';


function setupclarifai(imageUrl) {
  const PAT = 'ec3d77d6047b49c98c552654b7781c44';
  const USER_ID = '1bhpznnjeiuj';
  const APP_ID = 'test';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
  const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
  });
  
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return { requestOptions, MODEL_ID, MODEL_VERSION_ID };
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { requestOptions, MODEL_ID, MODEL_VERSION_ID } = setupclarifai();
  const [box,setBox] = useState({})

  /* const calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage')
    debugger
    const width = Number(image.width)
    const height = Number(image.height)
    console.log(width,height,clarifaiFace)
  } */
  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    /* return {
      leftCol: (clarifaiFace.left_col * width).toFixed(3),
      topRow: (clarifaiFace.top_row * height).toFixed(3),
      rightCol: (width - (clarifaiFace.right_col * width)).toFixed(3),
      bottomRow: (height - (clarifaiFace.bottom_row * height)).toFixed(3)
    } */
    const leftCol = (clarifaiFace.left_col * width).toFixed(3)
    const topRow = (clarifaiFace.top_row * height).toFixed(3)
    const rightCol = (width - (clarifaiFace.right_col * width)).toFixed(3)
    const bottomRow = (height - (clarifaiFace.bottom_row * height)).toFixed(3)
    
    setBox({
      leftCol: leftCol,
      topRow: topRow,
      rightCol: rightCol,
      bottomRow: bottomRow
    })
  }

  /* const displayFaceBox = (box) => {
    setBox({box: box}); 
  } */
  

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const onButtonSubmit = () => {
    if (!inputValue) {
      console.log("Please enter a valid input value.");
      return;
    }
    setImageUrl(inputValue);


    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      calculateFaceLocation(result)
      /* const regions = result.outputs[0].data.regions;
      
      regions.forEach(region => {
        const boundingBox = region.region_info.bounding_box;
        const topRow = boundingBox.top_row.toFixed(3);
        const leftCol = boundingBox.left_col.toFixed(3);
        const bottomRow = boundingBox.bottom_row.toFixed(3);
        const rightCol = boundingBox.right_col.toFixed(3);
        setBox({
          leftCol: leftCol,
          topRow: topRow,
          rightCol: rightCol,
          bottomRow: bottomRow
        })
      }); */
  





    })
    .catch(error => console.error('Error:', error));
  
  };

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm  onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
      <FaceRecognition box = {box} imageUrl={imageUrl}/>
    </div>
  );
  }

export default App;
