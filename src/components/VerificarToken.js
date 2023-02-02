import axios from "axios";
import { Button } from "react-bootstrap";
const VerificarToken = ()=>{
    function verificar (){
        const token = localStorage.getItem('token');
        if (token){
        axios.get("http://localhost:5000/alumnos/isAuth", {
            headers: {
                "x-access-token":token,
            }

        }).then((response)=>{
            console.log(response.data)
        });
    }else {
        console.log('no token');
    }
        return 0;
    }
    return(
        <>
        <Button onClick={verificar}>Verificar</Button>
        </>
    );
}
export default VerificarToken;