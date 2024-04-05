
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider"
import { Modal, Button, Form, NavDropdown } from "react-bootstrap"
import {
    GoogleAuthProvider,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth"



export default function Header() {
    const [showLoginModal, setShowLoginModal] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleShowSignUp = () => setShowLoginModal("SignUp");
    const handleShowLogin = () => setShowLoginModal("login");
    const [errorMessage, setErrorMessage] = useState("");
    const auth = getAuth();
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && currentUser.isAuthenticated) {
            navigate("/homepage");
        }
    }, [currentUser, navigate]);


    const provider = new GoogleAuthProvider();
    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, provider);
            handleClose();
        } catch (error) {
            console.error(error);
        }
    }


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
            window.alert("Login successful!");
            handleClose();
            navigate("/homepage");
        } catch (error) {
            console.error(error);
            // Show error message
            setErrorMessage("Invalid username or password. Please try again.");
            setTimeout(() => {
                setErrorMessage("");
            }, 10000);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                username,
                password
            );
            console.log(res.user);
            // Show success message
            window.alert("Sign-up successful!");
            // Close the modal
            handleClose();
            // Navigate to homepage
            navigate("/homepage");
        } catch (error) {
            console.error(error);
        }
    }


    const handleClose = () => {
        console.log("Closing modal");
        setShowLoginModal(null);
    };



    const handleLogout = () => {
        if (!currentUser) {
            // If user is already logged out, show alert
            alert("You are already logged out.");
            return;
        }

        auth.signOut()
            .then(() => {
                // Show logout success message
                alert("Logout successful!");
                // Navigate to profilepage.jsx
                navigate("/homepage");
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    };


    return (
        <>
            <header className="main-header header-style-one">
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-md-6 p-2">
                            <ul className="social-links list-unstyled d-flex mb-0">
                                <li className="me-4"><a href="https://www.facebook.com/profile.php?id=100063044389705"><i className="bi bi-facebook text-muted"></i></a></li>
                                <li className="me-4"><a href="#"><i className="bi bi-twitter text-muted"></i></a></li>
                                <li className="me-4"><a href="#"><i className="bi bi-google text-muted"></i></a></li>
                                <li><a href="#"><i className="bi bi-linkedin text-muted"></i></a></li>
                            </ul>
                        </div>

                        <div className="col-md-6 d-flex flex-column justify-content-md-end justify-content-center align-items-center align-items-md-end">
                            <ul className="top-links list-unstyled mb-0 d-flex align-items-center">
                                <li className="me-3 border-end pe-3"><a href="#" className="text-decoration-none"><i className="bi bi-telephone text-muted"></i><span className="text-muted d-none d-md-inline"> +603-8888 8888</span></a></li>
                                <li><a href="mailto:paramountvalley@live.com" className="text-decoration-none"><i className="bi bi-envelope text-muted"></i><span className="text-muted d-none d-md-inline"> paramount@live.com</span></a></li>

                                <li>
                                    {currentUser ? (
                                        <NavDropdown title={<i className="bi bi-person-circle text-muted ms-3" style={{ fontSize: "2rem" }} />} className="remove-dropdown-arrow" id="basic-nav-dropdown" >
                                            <NavDropdown.Item href="/profilepage">My Profile</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                        </NavDropdown>
                                    ) : (
                                        <li>
                                            <a href="#" className="text-decoration-none" onClick={handleShowLogin}>
                                                <i className="bi bi-person-circle text-muted ms-3" style={{ fontSize: "2rem" }}></i>
                                            </a>
                                        </li>
                                    )}
                                </li>


                            </ul>
                        </div>

                    </div>
                </div>
            </header >
            <Modal
                show={showLoginModal !== null}
                onHide={handleClose}
                animation={false}
                centered
            >
                <Modal.Title className="text-center">
                    {showLoginModal === "SignUp" ? "Create your account" : "Login With"}
                </Modal.Title>
                <Modal.Body>
                    <Form
                        className="d-grid gap-2 px-5"
                        onSubmit={showLoginModal === "SignUp" ? handleSignUp : handleLogin}
                    >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                onChange={(e) => setUsername(e.target.value)}
                                type="email"
                                placeholder="Enter username"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Group>
                        {showLoginModal === "login" && errorMessage && (
                            <p style={{ color: "red", marginBottom: "15px" }}>
                                {errorMessage}
                            </p>
                        )}
                        {showLoginModal === "SignUp" && (
                            <p style={{ fontSize: "12px" }}>
                                By signing up, you agree to the Terms of Service and Policy.
                            </p>
                        )}
                        <Button className="rounded-pill" type="submit">
                            {showLoginModal === "SignUp" ? "Sign up" : "Log in"}
                        </Button>
                        <p className="text-center p-2"> or use a social networks</p>
                        <div className="d-flex justify-content-center">
                            <Button
                                className="rounded-circle btn-sm border-0 me-5"
                                variant="outline-dark"
                                style={{ width: "50px", height: "50px", backgroundColor: "#DE4444" }}
                                onClick={handleGoogleLogin}
                            >
                                <i className="bi bi-google fs-4 text-white"></i>
                            </Button>
                            <Button
                                className="rounded-circle btn-sm border-0"
                                variant="outline-dark"
                                style={{ width: "50px", height: "50px", backgroundColor: "#2E53A4" }}
                            >
                                <i className="fab fa-facebook-f fs-4 text-white"></i>
                            </Button>
                        </div>
                        <hr />
                        <div className="text-center text-muted">
                            Looking to{" "}
                            <a href="#" className="text-decoration-none text-primary fw-bold" onClick={handleShowSignUp}>
                                create an account
                            </a>
                            ?
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    )
} 