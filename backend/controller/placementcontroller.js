const PlacementModel = require('../models/PlacementModel');

const getPlacementRecords = async (req, res) => {
    try {
        const { placementIds } = req.body;

        if (!placementIds || !Array.isArray(placementIds)) {
            return res.status(400).json({ message: "Invalid placement IDs" });
        }

        const placements = await PlacementModel.find({ _id: { $in: placementIds } });

        return res.status(200).json(placements);
    } catch (error) {
        console.error("Error fetching placements:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getPlacementRecords };
