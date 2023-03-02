import axios from "axios";
import { useEffect, useState } from "react";


const Alumnos = () => {
    useEffect (() => {

},[])

const [l, setl] = useState();


const verificarUsuario = async () => {
    const token = localStorage.getItem('token');
    await 
    axios
    .get("/localhost:5000/alumnos/isAuth", {
        headers:{
            "x-access-token": token,
        }
    })
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
    return 0;
}


    return ( 
        <h1>Bienvenidos Alumnos</h1>
     );
}
 
export default Alumnos;