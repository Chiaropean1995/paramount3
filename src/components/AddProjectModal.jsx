import { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import axios from "axios"


export default function AddProjectModal({ onAddProject }) {
    const url = "https://42e2d4c7-4728-4e76-8c44-8e4da3a125d5-00-3ro9yw4eg7bhh.riker.replit.dev"
    const [show, setShow] = useState(false);
    const [imageUrl, setImageURL] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        price: '',
        image_url: null,
        title: '',
        location: '',
        description: '',
        car_park: '',
        bathroom: '',
        bedroom: '',
        room_size: '',
        progress_percentage: '',
    });



    const uploadImage = async (file) => {
        try {
            if (!file) {
                return null;
            }

            const fileName = file.name;
            console.log("File Name:", fileName);

            const imageRef = ref(storage, `images/${fileName}`);
            await uploadBytes(imageRef, file);
            console.log("File uploaded successfully!");

            const imageURL = await getDownloadURL(imageRef);
            setImageURL(imageURL);

            return imageUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(true);

        try {
            let imageUrl = null;

            if (file) {
                // Upload image to Firebase Storage
                const fileName = file.name;
                const imageRef = ref(storage, `images/${fileName}`);
                await uploadBytes(imageRef, file);
                console.log("File uploaded successfully!");

                // Get download URL
                imageUrl = await getDownloadURL(imageRef);
                console.log("Download URL:", imageUrl);
            }

            // Include imageUrl in the form data
            const formDataWithImageUrl = {
                ...formData,
                image_url: imageUrl
            };

            // Send form data with imageUrl to the server
            const response = await axios.post(`${url}/projects`, formDataWithImageUrl);
            console.log(response.data);

            // Call the onAddProject function with the newly added project
            onAddProject(response.data);

            handleClose();
            window.alert('Project successfully added!');
            window.location.reload();
        } catch (error) {
            console.error('Error adding project:', error);
        } finally {
            setLoading(false); // Set loading state back to false when submission is complete
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                +
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form encType="multipart/form-data">
                        <Form.Group controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage_url">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image_url"
                                onChange={handleFileChange}
                                accept="image/jpeg"
                            />

                        </Form.Group>

                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCar_park">
                            <Form.Label>Car Park</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                name="car_park"
                                value={formData.car_park}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBathroom">
                            <Form.Label>Bathroom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                name="bathroom"
                                value={formData.bathroom}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBedroom">
                            <Form.Label>Bedroom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter no"
                                name="bedroom"
                                value={formData.bedroom}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="room_size">
                            <Form.Label>Built Up</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter sq.ft"
                                name="room_size"
                                value={formData.room_size}
                                onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="progress_percentage">
                            <Form.Label>Progress Percentage</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter %"
                                name="progress_percentage"
                                value={formData.progress_percentage}
                                onChange={handleInputChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={(e) => { handleSubmit(e); uploadImage(); }}>
                        {loading ? <Spinner /> : 'Submit'} {/* Render spinner if loading, otherwise render 'Submit' button */}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
