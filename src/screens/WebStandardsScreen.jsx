import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Placeholder from 'react-bootstrap/Placeholder';
import Row from 'react-bootstrap/Row';

const isRegexMatch = (query, string) => {
    const regex = new RegExp(query, "i");
    return regex.test(string);
}

function WebStandardsScreen() {

    const [standards, setStandards] = useState([]);
    const [query, setQuery] = useState('');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        axios.get("/static/web-standards.json").then(response => {
            setStandards(response.data);
        });
    }, []);

    const handleOnChange = e => {
        const newQuery = e.target.value;

        try {
            // Will throw exception if invalid regex
            RegExp(newQuery, "i");

            setQuery(newQuery);
            setIsValid(true);
        } catch {
            setIsValid(false);
        }
    }

    return (
        <>
            <Container className="p-5">

                <h1>Web Standards</h1>

                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <InputGroup className="my-3">
                            <InputGroup.Text>/&gt;</InputGroup.Text>
                            <Form.Control
                                placeholder="HTML, Fetch, WebSockets, ..."
                                aria-label="Search"
                                onChange={handleOnChange}
                                isInvalid={!isValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid regular expression!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Col>
                </Row>


                <ListGroup>
                    {standards.map((entry, index) => (
                        isRegexMatch(query, entry['name']) && <ListGroup.Item
                            key={index} action
                        >
                            {entry.name}
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="stretched-link"
                                to={entry.href}
                            />
                        </ListGroup.Item>
                    ))}

                    {standards.length === 0 && [12, 6, 10, 4].map(entry => (
                        <ListGroup.Item key={entry} action>
                            <Placeholder animation="glow">
                                <Placeholder
                                    size="lg"
                                    xs={entry}
                                />
                            </Placeholder>
                        </ListGroup.Item>
                    ))}

                </ListGroup>

                <div className="d-flex justify-content-end p-3">
                    <p className="text-muted">
                        Total # of standards: <b>{standards.length}</b>
                    </p>
                </div>
            </Container>
        </>
    )
}

export default WebStandardsScreen;
