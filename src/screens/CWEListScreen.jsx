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

const isMatch = (query, string) => {
    const lowerCaseQuery = query.toLowerCase();
    return string.includes(lowerCaseQuery);
};

const getListItem = cwe => {

    return <>
        <div className="d-inline">
            {cwe['Title']}
        </div>
        <div className="d-inline text-secondary ps-2">
            {`[${cwe['Status']}]`}
        </div>
        <div className="text-secondary">
            {cwe['Description']}
        </div>
        <div className="text-secondary">
            {cwe['ExtendedDescription']}
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

    useEffect(() => {
        axios.get("/static/cwe-list.json").then(response => {
            const tempCweList = response.data.map(cwe => {
                const searchableArr = [
                    cwe['Title'].toLowerCase(),
                    cwe['Description'].toLowerCase(),
                    cwe['ExtendedDescription']?.toLowerCase(),
                ];
                cwe['Searchable'] = searchableArr.join("\n");
                return cwe;
            });
            setCweList(tempCweList);
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
                                onChange={e => setQuery(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                </Row>

                <ListGroup>
                    {cweList.map((entry, index) => (
                        isMatch(query, entry['Searchable']) && <ListGroup.Item
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
