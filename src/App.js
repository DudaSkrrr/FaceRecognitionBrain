import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
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
  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": imageUrl
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
  const [route,setRoute] = useState('signin')
  const [isSignedIn,setIsSignedIn] =  useState(false)


  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

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

    })
    .catch(error => console.error('Error:', error));
  
  };


  const onRouteChange = (route) => {
    if(route === 'signout'){
      setIsSignedIn(false)
    }else if(route === 'home'){
      setIsSignedIn(true)
    }
    setRoute(route);
  }

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      { route === 'home'
        ? <div>
            <Logo />
            <Rank
              /* name={this.state.user.name}
              entries={this.state.user.entries} */
            />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
           route === 'signin'
           ? <Signin /* loadUser={loadUser} */ onRouteChange={onRouteChange}/>
           : <Register /* loadUser={loadUser} */ onRouteChange={onRouteChange}/>
          )
      }
    </div>
  );
}

export default App;