import './App.css';
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';
import Register from './components/Register/Register.jsx'
import Rank from './components/Rank/Rank.jsx';
import Signin from './components/Signin/Signin.jsx';
import ParticlesBg from 'particles-bg'
import { useState } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route,setRoute] = useState('signin')
  const [isSignedIn,setIsSignedIn] =  useState(false)
  const [user,setUser] = useState({
    id:'',
    name:'',
    email:'',
    entries:'',
    joined:''
  })
  const initialState = () => {
    setInputValue('')
    setImageUrl('')
    setBox({})
    setRoute('signin')
    setIsSignedIn(false)
    setUser({
      id:'',
      name:'',
      email:'',
      entries:'',
      joined:''
    })
  }

  const setupClarifai = (imageUrl) => {
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

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }
  const calculateFaceLocation = (data) => {
    console.log('data', data);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
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
  
    const { requestOptions, MODEL_ID, MODEL_VERSION_ID } = setupClarifai(inputValue);
  
    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        setBox(calculateFaceLocation(result));
      })
      .catch(error => console.error('Error:', error));
  
    fetch('https://facerecognition-backend-xzew.onrender.com/image', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: user.id
      })
    })
    .then(response => response.json())
    .then(count => {
      setUser(prevUser => ({
        ...prevUser,
        entries: count
      }));
    })
    .catch(error => console.error('Error updating user entries:', error));
  }

  const onRouteChange = (route) => {
    if(route === 'signin'){
      initialState()
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
              name={user.name} // Make sure user.name is correctly set
              entries={user.entries}
            />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
           route === 'signin'
           ? <Signin loadUser={loadUser} onRouteChange={onRouteChange}/>
           : <Register loadUser={loadUser} onRouteChange={onRouteChange}/>
          )
      }
    </div>
  );
}

export default App;