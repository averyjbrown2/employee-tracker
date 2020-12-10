DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,4) NULL,
    department_id INT default 0
);

CREATE TABLE employee(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY ,
    employee_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL
);