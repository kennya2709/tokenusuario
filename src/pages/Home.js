import { Button, Row, Col, Container } from "react-bootstrap";
import  {Link } from "react-router-dom";

const Home = () => {
    return ( 
        <Container className="mt-3">
            <Row>
                <Col>
                <Button variant="primary" as={Link} to='/alumnos'>
                    Alumnos
                </Button>
                </Col>
                <Col>
                    <Button variant="primary" as={Link} to='/alumnos'>
                    Profesores
                </Button>
                
                </Col>
                <Col>
                <Button variant="primary" as={Link} to='/alumnos'>
                    Administrativo
                </Button></Col>
            </Row>
        </Container>
     );
}
 
export default Home;