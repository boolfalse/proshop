
import {Navbar, Nav, Container, Badge, NavDropdown} from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from "react-router-bootstrap";
import logo from '../assets/logo.png';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {flushCredentials} from "../slices/authSlice";
import {toast} from "react-toastify";
import {useLogoutMutation} from "../slices/usersApiSlice";

const Header = () => {
    const { cartItems } = useSelector(state => state.cart);
    const { userInfo } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall, {isLoading, error}] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            const res = await logoutApiCall().unwrap();
            dispatch(flushCredentials());
            navigate('/login');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <img src={logo} alt="ProShop" />
                            ProShop
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navnar-nav" />
                    <Navbar.Collapse id="basic-navnar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link href="/cart">
                                    <FaShoppingCart /> Cart
                                    {cartItems.length > 0 && (
                                        <Badge pill bg="success" className="ms-1">
                                            {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link><FaUser /> Login</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
