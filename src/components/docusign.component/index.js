import { useState } from "react";
const SignDocument = ({ request_type = "embedded" }) => {
    const [isEmailRequest] = useState(request_type === "email");

    return ""
}
export default SignDocument;