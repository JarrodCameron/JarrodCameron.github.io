import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
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
};

const handleOnChange = (e, setQuery, setIsValid) => {
    const newQuery = e.target.value;

    try {
        // Will throw exception if invalid regex
        RegExp(newQuery, "i");

        setQuery(newQuery);
        setIsValid(true);
    } catch {
        setIsValid(false);
    }
};

const getListItem = cwe => {

    return <>
        <div className="d-inline">
            {`CWE-${cwe['ID']}: ${cwe['Name']}`}
        </div>
        <div className="d-inline text-secondary ps-2">
            {`[${cwe['Status']}]`}
        </div>
        <Link
            target="_blank"
            rel="noopener noreferrer"
            className="stretched-link"
            to={`https://cwe.mitre.org/data/definitions/${cwe['ID']}.html`}
        />
    </>
};

function CWEListScreen() {

    const [cweList, setCweList] = useState([]);
    const [query, setQuery] = useState('');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        axios.get("/static/cwe-list.json").then(response => {
            setCweList(response.data);
        });
    }, []);

    return (
        <>
            <Container className="p-5">

                <h1>CWE List</h1>

                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <InputGroup className="my-3">
                            <InputGroup.Text>/&gt;</InputGroup.Text>
                            <Form.Control
                                placeholder="Buffer Overflow, SQL Injection, BAC, ..."
                                aria-label="Search"
                                onChange={
                                    e => handleOnChange(e, setQuery, setIsValid)
                                }
                                isInvalid={!isValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid regular expression!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Col>
                </Row>

                <ListGroup>
                    {cweList.map((entry, index) => (
                        isRegexMatch(query, entry['Name']) && <ListGroup.Item
                            key={index} action
                        >
                            {getListItem(entry)}
                        </ListGroup.Item>
                    ))}

                    {cweList.length === 0 && [12, 6, 10, 4].map(entry => (
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

            </Container>
        </>
    )
}

export default CWEListScreen;
