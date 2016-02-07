var mongoose = require('mongoose')
module.exports = new mongoose.Schema({
	projectId: mongoose.Schema.Types.ObjectId
	, location: String
	, date: Date
	, documents: String
	, type: {
		type: String
		, enum: ['continuance', 'consent', 'regular', 'review']
	}
	, id: String
	, packetUrl: String
	, staffContact: {
		name: String
		, phone: String
	}
	, description: String
	, preliminaryRecommendation: String
	, action: String
})
