
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <Navbar.Brand href="/">ProShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navnar-nav" />
                    <Navbar.Collapse id="basic-navnar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/cart"><FaShoppingCart /> Cart</Nav.Link>
                            <Nav.Link href="/login"><FaUser /> Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;

