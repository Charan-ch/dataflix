import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const TaskManager = () => {
    const history = useNavigate()

    return (
        <div className="task-manager">
            <Container text>
                <Header as="h1">Employee Task Manager</Header>
                <p>
                    Welcome to our task management system! Here, employees can manage their daily tasks efficiently.
                </p>
                <p>
                    Organize your work, track progress, and collaborate with your team.
                </p>
                <div className="button-container">
                    <Button color="green" size="huge" onClick={() => history('/registration')}>Register</Button>
                    <Button color="blue" size="huge" onClick={() => history('/login')}>Login</Button>
                </div>
            </Container>
        </div>
    );
};

export default TaskManager;
