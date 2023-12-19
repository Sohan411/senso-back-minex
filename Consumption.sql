DELIMITER //

CREATE EVENT update_and_insert_records
ON SCHEDULE EVERY 10 MINUTE
DO
BEGIN
    UPDATE tmp.tms_Day_Consumption AS tdc
    SET totalVolume = (
        SELECT MAX(ad.totalVolume) - MIN(ad.totalVolume)
        FROM tmp.actual_data ad
        WHERE ad.DeviceUID = tdc.DeviceUID
            AND DATE(ad.TimeStamp) = tdc.TimeStamp
            AND ad.DeviceUID IN (SELECT DISTINCT DeviceUID FROM tmp.tms_devices WHERE DeviceType = 'ws')
        GROUP BY ad.DeviceUID, DATE(ad.TimeStamp)
    )
    WHERE EXISTS (
        SELECT 1
        FROM tmp.actual_data ad
        WHERE ad.DeviceUID = tdc.DeviceUID
            AND DATE(ad.TimeStamp) = tdc.TimeStamp
            AND ad.DeviceUID IN (SELECT DISTINCT DeviceUID FROM tmp.tms_devices WHERE DeviceType = 'ws')
        GROUP BY ad.DeviceUID, DATE(ad.TimeStamp)
    );
    
    INSERT INTO tmp.tms_Day_Consumption (DeviceUID, TimeStamp, totalVolume)
    SELECT
        ad.DeviceUID,
        DATE(ad.TimeStamp) AS TimeStamp,
        MAX(ad.totalVolume) - MIN(ad.totalVolume) AS totalVolume
    FROM tmp.actual_data ad
    WHERE ad.DeviceUID IN (SELECT DISTINCT DeviceUID FROM tmp.tms_devices WHERE DeviceType = 'ws')
        AND NOT EXISTS (
            SELECT 1
            FROM tmp.tms_Day_Consumption tdc
            WHERE tdc.DeviceUID = ad.DeviceUID
                AND DATE(tdc.TimeStamp) = DATE(ad.TimeStamp)
        )
    GROUP BY ad.DeviceUID, DATE(ad.TimeStamp);
END //

DELIMITER ;
