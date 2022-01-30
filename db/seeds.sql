INSERT INTO departments (name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Lead', 50000.00, 4),
    ('Salesperson', 35000.00, 4),
    ('Lead Engineer', 100000.00, 1),
    ('Software Engineer', 85000.00, 1),
    ('Account Manager', 65000.00, 2),
    ('Lawyer', 90000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 4, 1)