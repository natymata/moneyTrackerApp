use accounts;

/*INSERTS TABLE USER TYPE*/
INSERT INTO tbUserType
(userTypeName) 
VALUES 
('admin');

INSERT INTO tbUserType
(userTypeName) 
VALUES 
('user');

/*INSERTS TABLE USER*/
INSERT INTO tbUser
(userId, name, lastName, username, password, money, accountType, tbUserType_idUserType, Active) 
VALUES 
('usr1480186635766Admn', 'Admin', 'App', 'admin', '111111', 'colones', 'debito', 1, 1);

INSERT INTO tbUser
(userId, name, lastName, username, password, money, accountType, tbUserType_idUserType, Active) 
VALUES 
('usr1480186635766TCSa', 'Naty', 'Mata', 'natymata', '111111', 'colones', 'debito', 2, 1);

