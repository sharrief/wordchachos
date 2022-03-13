import { Navbar, Container } from "react-bootstrap";
import { Labels } from "@messages";

export function Navigation() {
  return <Navbar expand="lg" variant="dark" bg="dark">
    <Container className='justify-content-center'>
      <Navbar.Brand>{Labels.SiteTitle.toUpperCase()}</Navbar.Brand>
    </Container>
  </Navbar>
}