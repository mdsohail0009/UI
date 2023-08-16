import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
const NavBar =()=>{
    const { loginWithRedirect } = useAuth0();
    
    return (
        <>
         <Button className='acount-type'   onClick={() => loginWithRedirect()}>Log in</Button>
        </>
    )
}
export default NavBar;