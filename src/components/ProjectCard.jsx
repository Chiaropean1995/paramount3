import '@fortawesome/fontawesome-free/css/all.css'
import ProgressBar from 'react-bootstrap/ProgressBar';
import '../App.css'
import { Link } from 'react-router-dom';
import { useState, useContext } from "react"
import { AuthContext } from "../components/AuthProvider";
import { Form, Modal, Button, Spinner } from "react-bootstrap";
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from "axios"

export default function ProjectCard({ id, price, image_url, title, location, description, car_park, bathroom, bedroom, room_size, progress_percentage, onDelete, }) {
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [selectedProject, setSelectedProject] = useState(null);
    const [updatedProject, setUpdatedProject] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [updatedImage, setUpdatedImage] = useState(null);
    const url = "https://42e2d4c7-4728-4e76-8c44-8e4da3a125d5-00-3ro9yw4eg7bhh.riker.replit.dev"




    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${url}/allprojects`);
            setProjects(response.data); // Set the fetched projects to state

        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            if (selectedProject) {
                setUpdating(true); // Set updating to true when update process starts

                let imageUrl = updatedProject.image_url; // Preserve the existing image URL

                // Check if there's a new image selected for update
                if (updatedImage) {
                    // Upload the new image to Firebase Storage
                    const fileName = updatedImage.name;
                    const imageRef = ref(storage, `images/${fileName}`);
                    await uploadBytes(imageRef, updatedImage);
                    console.log("File uploaded successfully!");

                    // Get the download URL for the new image
                    imageUrl = await getDownloadURL(imageRef);
                    console.log("New Download URL:", imageUrl);
                }

                // Include the new image URL in the updated project data
                const updatedProjectData = {
                    ...updatedProject,
                    image_url: imageUrl
                };

                // Send the updated project data to the server
                await axios.put(`${url}/projects/${id}`, updatedProjectData);
                setShowModal(false);

                // Fetch updated projects immediately after update
                fetchProjects();

                // Optionally, you can choose to update the state with the updated project

                window.alert('Project successfully updated!');
                window.location.reload(); // Reload the page after update
            }
        } catch (error) {
            console.error('Error updating project:', error);
        } finally {
            setUpdating(false); // Set updating back to false after update process completes
        }
    };

    const handleDelete = async () => {
        setDeleting(true); // Set deleting state to true when delete action starts
        try {
            await onDelete(); // Call onDelete function, which should handle the delete action
        } catch (error) {
            console.error('Error deleting project:', error);
        } finally {
            setDeleting(false); // Reset deleting state after deletion attempt
        }
    };


    return (

        <div className="project-card border p-0 shadow" style={{ borderRadius: "10px", backgroundColor: "#E6EFF1" }}
        >
            <div className=" position-relative">
                <div className="price  text-white position-absolute bottom-0 end-0 d-flex justify-content-center align-items-center" style={{ width: "150px", height: "40px", backgroundColor: "rgba(1, 174, 239, 0.80)" }}>{price}</div>
                <Link to={`/projectdetail${id}`}>

                    <img src={image_url} className="img-fluid" style={{ height: '300px', width: "500px", borderTopLeftRadius: '10px', borderTopRightRadius: '10px', transition: 'transform 0.3s ease-in-out' }}
                    />
                </Link>
            </div>
            <h3 style={{ fontFamily: "Helvetica Neue, Helvetica, Arial,Source Sans Pro, serif", fontSize: "15px", marginLeft: "20px", marginTop: "10px" }}><b>{title}</b></h3>
            <p style={{ fontFamily: "Helvetica Neue, Helvetica, Arial,Source Sans Pro, serif", fontSize: "14px", marginLeft: "20px", color: "grey" }}>{location}</p>
            <hr style={{ margin: "0 20px" }} />
            <div className="d-flex align-items-center" style={{ marginTop: "10px" }}>
                <p style={{ fontFamily: "Helvetica Neue, Helvetica, Arial,Source Sans Pro, serif", color: "grey", fontSize: "14px", marginLeft: "20px", maxWidth: "calc(100% - 40px)", overflowWrap: "break-word" }}>{description}</p>
            </div>
            <hr style={{ margin: "0 20px" }} />
            <div className="icons-container" style={{ marginLeft: "20px", marginRight: "20px", marginBottom: "10px", marginTop: "10px" }}>
                <div className="icons d-flex justify-content-between">
                    <span><i className="fa fa-car text-muted me-3 " aria-hidden="true"></i> {car_park}</span>
                    <span><i className="fa fa-bath text-muted me-3" aria-hidden="true"></i> {bathroom}</span>
                    <span><i className="fa fa-bed text-muted me-3" aria-hidden="true"></i> {bedroom}</span>
                    <span><i className="fa fa-square text-muted me-3" aria-hidden="true"></i>  {room_size}</span>
                </div>
                <div style={{ marginLeft: "50px", marginRight: "50px", marginTop: "20px" }}>
                    <ProgressBar animated variant="info" now={progress_percentage} label={`${progress_percentage}%`} />
                </div>
                {currentUser && (
                    <div className="text-center">
                        <button onClick={handleDelete} className="delete-button" style={{ width: "70px" }}>
                            {deleting ? (
                                <Spinner animation="border" size="sm" role="status" />
                            ) : (
                                "Delete"
                            )}
                        </button>
                        <button onClick={() => {
                            setSelectedProject(projects);
                            setUpdatedProject(projects);
                            setShowModal(true);
                        }} className="update-button" style={{ width: "70px" }}>
                            {updating ? (
                                <Spinner animation="border" size="sm" role="status" />
                            ) : (
                                "Update"
                            )}
                        </button>
                    </div>
                )}
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form encType="multipart/form-data">
                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedProject.price}
                                placeholder="Enter price"
                                onChange={(e) => setUpdatedProject({ ...updatedProject, price: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="image_url">
                            <Form.Label>Image</Form.Label>
                            {/* Display the current image if available */}
                            {updatedProject.image_url && (
                                <div>
                                    <img src={updatedProject.image_url} alt="Current Image" style={{ height: '300px', width: "500px" }} />
                                    <p>Current Image</p>
                                </div>
                            )}
                            {/* Input field to select a new image */}
                            <Form.Control
                                type="file"
                                onChange={(e) => setUpdatedImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={updatedProject.title}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="location">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location"
                                value={updatedProject.name}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, location: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={updatedProject.description}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="car_park">
                            <Form.Label>Car Park</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                value={updatedProject.car_park}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, car_park: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="bathroom">
                            <Form.Label>Bathroom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                value={updatedProject.bathrooom}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, bathroom: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="bedroom">
                            <Form.Label>Bedroom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                value={updatedProject.bedroom}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, bedroom: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="room_size">
                            <Form.Label>Built Up</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                value={updatedProject.room_size}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, room_size: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="progress_percentage">
                            <Form.Label>Progress Percentage</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter %"
                                value={updatedProject.progress_percentage}
                                onChange={(e) => setUpdatedProject({ ...updatedProject, progress_percentage: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        {updating ? (
                            <Spinner animation="border" size="sm" role="status" />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}