import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ipaddr from 'ipaddr.js';

// TODO Delete unneeded
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

/* TODO
 * - [ ] Footer:
 *   - [x] List of places we got the IPs from
 *   - [ ] Links to the sources
 * - [ ] Handle CIDRs as input
 * - [ ] Handle multiple IP addresses input
 * - [ ] Loading screen while downloading cidrs.json
 * - [ ] Badges:
 *   - [ ] Onhover: Show the CIDR
 *   - [ ] OnClick: Modal -> more info about CIDR
 * - [ ] Clicking an IP address should copy it to the clip board
 * - [ ] Get CIDRs for:
 *   - [ ] Static ranges (localhost, class A/B/C, etc)
 *   - [ ] Azure
 *   - [ ] Oracle
 *   - [ ] GCP
 *   - [ ] NSA
 *   - [ ] GitHub
 */

const CidrIndexes = [
    'https://www.cloudflare.com/ips-v4/#',
    'https://www.cloudflare.com/ips-v6/#',
    'https://ip-ranges.amazonaws.com/ip-ranges.json',
];

const isInCidr = (addr, cidr) => {
    if (addr.kind() !== cidr[0].kind())
        return false;

    return addr.match(cidr);
}

const getCidrs = (knownCidrsList, ipAddrStr) => {
    const addr = ipaddr.parse(ipAddrStr);
    return knownCidrsList.filter(x => isInCidr(addr, x['cidr']));
};

function WellknownIpsScreen() {

    const [knownCidrsList, setKnownCidrsList] = useState([]);
    const [query, setQuery] = useState(undefined);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        axios.get("/static/cidrs.json").then(response => {

            // Pre-compute cidr objects to speed up processing time
            const cidrsList = response.data.map(x => {
                x['cidr'] = ipaddr.parseCIDR(x['cidrStr']);
                return x;
            })
            setKnownCidrsList(cidrsList);
        });
    }, []);

    const handleOnChange = e => {
        const newQuery = e.target.value;

        if (ipaddr.isValid(newQuery) === false) {
            setIsValid(false);
        } else {
            setIsValid(true);
            setQuery(newQuery);
        }
    }

    return (
        <>
            <Container className="p-5">

                <h1>IP Checker</h1>

                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <InputGroup className="my-3">
                            <InputGroup.Text>/&gt;</InputGroup.Text>
                            <Form.Control
                                placeholder="127.0.0.1"
                                aria-label="Search"
                                onChange={handleOnChange}
                                isInvalid={!isValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Invalid IP address!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Col>
                </Row>


                <ListGroup>

                    {query && <ListGroup.Item
                        action
                        className="d-flex justify-content-between"
                    >
                        <div className="fw-bold">{query}</div>
                        <div className="pb-1">
                            {getCidrs(knownCidrsList, query).map((entry, index) => (
                                <Badge
                                    key={index}
                                    bg="primary"
                                    className="ms-2"
                                    pill
                                >{entry['name']}</Badge>
                            ))}
                        </div>
                    </ListGroup.Item>}

                </ListGroup>

                <div className="p-3 text-muted">
                    <p>IP addresses indexed:</p>
                    <ul>
                        {CidrIndexes.map((entry, index) => (
                            <li key={index}>
                                <Link
                                    to={entry}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{entry}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </>
    )
}

export default WellknownIpsScreen;

