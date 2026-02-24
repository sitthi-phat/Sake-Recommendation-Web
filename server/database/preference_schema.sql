CREATE TABLE IF NOT EXISTS customer_preference (
    PreferenceID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID VARCHAR(20) NOT NULL,
    SweetDry INT NOT NULL, -- 1(Sweet) to 5(Dry)
    LightRich INT NOT NULL, -- 1(Light) to 5(Rich)
    Fruity INT NOT NULL, -- 1(Low) to 5(High)
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (MemberID) REFERENCES customer_master (MemberID)
);