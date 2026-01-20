CREATE TABLE IF NOT EXISTS customer_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    MemberID VARCHAR(20) UNIQUE NOT NULL COMMENT 'Format: M00000001',
    NickName VARCHAR(100) NOT NULL,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    Mobile VARCHAR(20) COMMENT 'We will send you the promotion via SMS',
    Email VARCHAR(255) COMMENT 'We will send you the promotion via Email',
    ChannelUserID VARCHAR(255) NOT NULL,
    RegisteredChannel ENUM('Line', 'Google', 'Facebook') NOT NULL,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_channel_user (
        ChannelUserID,
        RegisteredChannel
    )
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;