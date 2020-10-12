USE employees_db;

INSERT INTO department(name)
VALUES
("Finance"),("Human Resources"),("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES
("sales", 80000, 3),("specialist", 60000, 2),("accountant", 80000, 1);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
("Hunter", "Kantner", 1, null),("Ryder", "Kantner", 2, 1),("Zeke", "Kantner", 3, 1);