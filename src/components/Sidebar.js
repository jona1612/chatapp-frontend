import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import Invite from "./Invite";
import "./Sidebar.css";


function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);

    function joinRoom(room, isPublic = true) {
        if (!user) {
            return alert("Please login");
        }
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);

        if (isPublic) {
            setPrivateMemberMsg(null);
        }
        // dispatch for notifications
        dispatch(resetNotifications(room));
    }

    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom != room) dispatch(addNotifications(room));
    });

    useEffect(() => {
        if (user) {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user");
        }
    }, []);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    function getRooms() {
        fetch("https://chatapp-jonathan.vercel.app/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        joinRoom(roomId, false);
    }

    if (!user) {
        return <></>;
    }


    return (
        <div className="sidebar-main">
            <div className="mb-3">
                <h2>Groups Available</h2>
                <ListGroup>
                    {rooms.map((room, idx) => (
                        <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room == currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                            {room} {currentRoom !== room && <span className="badge rounded-pill bg-primary">{user.newMessages[room]}</span>}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
            <div>
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Members</h2>
                    <button icon="fa-solid fa-circle-plus" type="button" className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" >Invite <i class="fa-solid fa-plus"></i></button>
                    <Invite />
                </div>
                <ListGroup>
                    {members.map((member) => (
                        <ListGroup.Item key={member.id} style={{ cursor: "pointer" }} active={privateMemberMsg?._id == member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
                            <Row>
                                <Col xs={2} className="member-status">
                                    {
                                        member.picture ? <img src={member.picture} className="member-status-img" />
                                            :
                                            <div className="mx-auto ms-0" style={{ backgroundColor: "purple", border: "0.5px solid gray", width: "30px", height: "30px", borderRadius: "50%", color: "white", textAlign: "center", paddingTop: "2px" }} >
                                                {member.name[0]}
                                            </div>
                                    }

                                    {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                                </Col>
                                <Col xs={9}>
                                    {member.name}
                                    {member._id === user?._id && " (You)"}
                                    {member.status == "offline" && " (Offline)"}
                                </Col>
                                <Col xs={1}>
                                    <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
}

export default Sidebar;