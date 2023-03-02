import {Route, Routes} from 'react-router-dom';
import './App.css';
import Ingresar from './pages/Ingresar';
import Suscribir from './pages/Suscribir';
import Alumnos from "./pages/Alumnos";
import Home from "./pages/Home";
import BarraSuperior from './components/BarraSuperior';

function App() {
  return (
   <div classNAme="App">
<Routes>
  <Route path='/' element={ <BarraSuperior />}>
  <Route index element= { <Home />} />
  <Route path='alumnos' >
    <Route index element = {<Alumnos/>} />
    <Route path='Ingresar' element = { <Ingresar />} /> 
    <Route path ='Suscribir' element={ <Suscribir />} /> 
</Route>
  </Route>
</Routes>
   </div>
  );
}


export default App;
