import React, { useEffect, useState } from "react"
import SplashScreen from "react-native-splash-screen"
import Navigation from "./src/routes/Stacks"

const App = () => {

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <Navigation />
  );
}

export default App
