import { useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import Experience from "./Experience";

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 2] }}>
      {/* <OrbitControls /> */}
      <OrthographicCamera
        args={[-0.5, 0.5, 0.5, -0.5, -1000, 1000]}
        makeDefault
      />
      <Experience />
    </Canvas>
  );
}

export default App;
