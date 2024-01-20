import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Clarifai from 'clarifai'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import { useState } from 'react';

const app = new Clarifai.App({
  apiKey: '3a1505c09d9e4b029ca6a33b50a75793'
}); 

function App() {
  const [inputValue, setInputValue] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const onInputChange = (e) =>{
    setInputValue(e.target.value)
  }
  const onButtonSubmit = () =>{

    app.models
      .predict(
        'face-detection',
        inputValue
      )
      .then(
        setImageUrl(inputValue),
        function(response) {
          console.log(response)
        },
        function(err){
          //there was an error
        }
      )
  }


  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm  onInputChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
      <FaceRecognition  imageUrl={imageUrl}/>
    </div>
  );
}

export default App;
