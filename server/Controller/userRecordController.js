const UserRecord = require('../models/userRecordModel');

exports.getAllUserRecords = async (req, res, next) => {
    try {
        const records = await UserRecord.find();

        res.status(200).json({
            status: 'success',
            results: records.length,
            data: records
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
        throw new Error(err.message);
    };
};

exports.getUserRecordByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        const records = await UserRecord.find({
            name
        });

        res.status(200).json({
            status: 'success',
            results: records.length,
            data: records
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
        throw new Error(err.message);
    };
};

exports.deleteUserRecordByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        await UserRecord.deleteMany({
            name
        });

        res.status(204).json();
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        })
        throw new Error(err.message);
    };
};

exports.deleteAllUserRecords = async (req, res, next) => {
    try {
        await UserRecord.deleteMany();

        res.status(204).json();
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
        throw new Error(err.message);
    }
}