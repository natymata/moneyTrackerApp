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
('usr1480186635766Admn', 'Admin', 'App', 'admin', '$2y$10$6xT/eYN2SBxeYCaY8KBhT.iEo.fiUSdI0ti/ljBXXSz0FQUCbbtY.', 'colones', 'debito', 1, 1);

INSERT INTO tbUser
(userId, name, lastName, username, password, money, accountType, tbUserType_idUserType, Active) 
VALUES 
('usr1480186635766TCSa', 'Naty', 'Mata', 'natymata', '$2y$10$6xT/eYN2SBxeYCaY8KBhT.iEo.fiUSdI0ti/ljBXXSz0FQUCbbtY.', 'colones', 'debito', 2, 1);


/*INSERTS TABLE TRANSACTION */
INSERT INTO tbtransactions 
(transactId, date, amount, detail, shop, transactType, typeId) 
VALUES 
('trs1480561796912NqrZ', '2016-11-10 06:00:00', '5000', 'Compras', 'natyshop', 'Debito', 0);


INSERT INTO tbtransactions 
(transactId, date, amount, detail, shop, transactType, typeId) 
VALUES 
('trs1480561828649nXcj', '2016-11-10 06:00:00', '200000', 'Salario', 'IsaG', 'Credito', 1);

/*INSERTS TABLE TRANSACTXUSER*/

INSERT INTO tbtransactxuser 
(tbUser_userId, tbTransactios_transactd) 
VALUES ('usr1480186635766TCSa', 'trs1480561796912NqrZ');

INSERT INTO tbtransactxuser 
(tbUser_userId, tbTransactios_transactd) 
VALUES ('usr1480186635766TCSa', 'trs1480561828649nXcj');
