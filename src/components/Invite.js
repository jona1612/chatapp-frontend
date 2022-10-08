import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import { useSelector } from 'react-redux';



function Invite() {
    const user = useSelector((state) => state.user);
    const form = useRef();
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");

    // const formTemplate = {
    //     to_name: name,
    //     to_email: email,
    // }

    const sendEmail = (e) => {
        e.preventDefault();
        const emailForm = document.getElementById("emailForm")
        const input1 = document.createElement("input")
        input1.setAttribute("name", "from_name")
        input1.setAttribute("value", user.name)
        emailForm.appendChild(input1)
        console.log(form.current);

        emailjs.sendForm('service_cu4fji9', 'template_9chatapp', form.current, 'b6kvX_zRS6A0TdUv_')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
        input1.remove();
        e.target.reset();
    };

    return (


        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Invite Friends</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id='emailForm' ref={form} onSubmit={sendEmail}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Recipient Name:</label>
                                <input type="text" className="form-control" name='to_name' placeholder='John' />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="recipient-name" className="col-form-label">Recipient Email:</label>
                                <input type="email" className="form-control" name='to_email' placeholder='john@example.com' />
                            </div>
                            {/* <div className="mb-3">
                                <label htmlFor="message-text" className="col-form-label">Message:</label>
                                <textarea className="form-control" id="message-text"></textarea>
                            </div> */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}


export default Invite