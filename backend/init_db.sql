IF NOT EXISTS (SELECT name FROM master.dbo.sysdatabases WHERE name = N'MediRaksha-DB')
BEGIN
    CREATE DATABASE [MediRaksha-DB];
END
GO

USE [MediRaksha-DB];
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
BEGIN
    CREATE TABLE Users
    (
        Id INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(200) NOT NULL,
        UserName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(200),
        PasswordHash NVARCHAR(500) NOT NULL,
        RoleName NVARCHAR(50) NOT NULL,
        PhoneNumber NVARCHAR(20),
        IsActive BIT DEFAULT 1,
        CreatedDate DATETIME DEFAULT GETDATE()
    );
END
ELSE
BEGIN
    -- Add UserName column if it doesn't exist
    IF NOT EXISTS(SELECT * FROM sys.columns WHERE Name = N'UserName' AND Object_ID = Object_ID(N'Users'))
    BEGIN
        ALTER TABLE Users ADD UserName NVARCHAR(100) NULL;
    END
END
GO

-- Insert if not exists
IF NOT EXISTS (SELECT 1 FROM Users WHERE UserName = 'admin')
BEGIN
    INSERT INTO Users
    (
        FullName,
        UserName,
        Email,
        PasswordHash,
        RoleName,
        PhoneNumber
    )
    VALUES
    ('Rajender Thota','admin','rajyu@gmail.com','admin123','Admin','8688219475')
END
GO
