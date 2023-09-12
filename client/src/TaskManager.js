import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Checkbox, Menu } from 'semantic-ui-react';
import './TaskManager.css'
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
function TaskManager() {
    const history = useNavigate()
    const [tasks, setTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const [selectedTask, setSelectedTask] = useState({});
    const [formData, setFormData] = useState({ title: '', description: '', due_date: '', completed: false });

    const handleAddTask = () => {
        setFormData({ title: '', description: '', due_date: '', completed: false });
        setModalOpen(true);
    };
    const handleLogout = () => {
        sessionStorage.clear()
        history('/')
    };
    const handleEditTask = async (task) => {
        setSelectedTask(task);
        setFormData(task);
        setEditModalOpen(true);

    };

    const handleUpdateTask = async () => {
        const response = await fetch(`http://localhost:8000/updatetask/${selectedTask.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData: formData, uid: sessionStorage.getItem("userid") }),
        });

        if (response.ok) {
            setEditModalOpen(false);

            getTasks()
        } else {
            const errorData = await response.json();
            console.error(errorData);
        }
    }

    const handleDeleteTask = async (task) => {

        const response = await fetch(`http://localhost:8000/deletetask/${task.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            getTasks()
        } else {
            const errorData = await response.json();
            console.error(errorData);
        }
    };

    const handleToggleComplete = async (status,taskId) => {
        if (parseInt(status) === 1) {
            status = 0
        }else{
            status = 1
        }

        const response = await fetch(`http://localhost:8000/taskCompletedStatus/${status}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            getTasks()
        } else {
            const errorData = await response.json();
            console.error(errorData);
        }
    };

    const handleSaveTask = async () => {

        setTasks([...tasks, { ...formData, id: Date.now() }]);
        const response = await fetch('http://localhost:8000/addtasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData: formData, uid: sessionStorage.getItem("userid") }),
        });

        if (response.ok) {
            getTasks()
        } else {
            const errorData = await response.json();
            console.error(errorData);
        }
        setModalOpen(false);

    }


    useEffect(() => {
        getTasks()
    }, [])

    const getTasks = async () => {
        const response = await fetch('http://localhost:8000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: sessionStorage.getItem('userid') }),
        });

        if (response.ok) {
            const responseData = await response.json();
            setTasks(responseData)
        } else {
            const errorData = await response.json();
            console.error(errorData);
        }
    }

    return (
        <div>

            <Menu color='blue' inverted >
                <Menu.Item header>Task Manager</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
                </Menu.Menu>
            </Menu>

            <div className='task-manager-table'>

                <h2>Hi {sessionStorage.getItem('username')}, Here are your tasks</h2>
                <Button primary onClick={handleAddTask}>Add Task</Button>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Due Date</Table.HeaderCell>
                            <Table.HeaderCell>Completed</Table.HeaderCell>
                            <Table.HeaderCell>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {tasks.map((task) => (
                            <Table.Row key={task.id}>
                                <Table.Cell>{task.title}</Table.Cell>
                                <Table.Cell>{task.description}</Table.Cell>
                                <Table.Cell>{moment(task.due_date).format('YYYY-MM-DD')}</Table.Cell>
                                <Table.Cell>
                                    <Checkbox
                                        toggle
                                        checked={parseInt(task.completed) === 1 ? true : false}
                                        onChange={() => handleToggleComplete(task.completed,task.id)}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <Button primary onClick={() => handleEditTask(task)}>Edit</Button>
                                    <Button negative onClick={() => handleDeleteTask(task)}>Delete</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Modal.Header>Add Task</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={(e, { name, value }) => setFormData({ ...formData, [name]: value })}
                            />
                            <Form.Input
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={(e, { name, value }) => setFormData({ ...formData, [name]: value })}
                            />
                            <Form.Input
                                label="Due Date"
                                name="due_date"
                                value={moment(formData.due_date).format("YYYY-MM-DD")}
                                onChange={(e, { name, value }) => setFormData({ ...formData, [name]: value })}
                                type='date'
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button primary onClick={handleSaveTask}>Save</Button>
                    </Modal.Actions>
                </Modal>


                <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                    <Modal.Header>Edit Task</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={(e, { name, value }) => setFormData({ ...formData, [name]: value })}
                            />
                            <Form.Input
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={(e, { name, value }) => setFormData({ ...formData, [name]: value })}
                            />
                            <Form.Input
                                label="Due Date"
                                name="due_date"
                                value={moment(formData.due_date).format("YYYY-MM-DD")}
                                onChange={(e, { name, value }) => setFormData({ ...formData, [name]: value })}
                                type='date'
                            />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                        <Button primary onClick={handleUpdateTask}>Update</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        </div>
    );
}

export default TaskManager;
