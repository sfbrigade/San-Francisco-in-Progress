var mongoose = require('mongoose')
var projectHearingSchema = require('./project_hearing_schema.js')
// The SF Planning Commission holds a weekly meeting where they rule on various
// items concerning development projects.
//
// Example Data:
//   projectId: ...
//   location:
//     Commission Chambers
//     Room 400, City Hall
//     1 Dr. Carlton B. Goodlett Place
//   date: 12:00 PM, June 11, 2015
//   documents: ""
//   type: "regular"
//   id: "2013.1238CV"
//   packetUrl: "http://commissions.sfplanning.org/cpcpackets/2013.1238CV.pdf"
//   staffContact: {
//     name: "S. VELLVE"
//     phone: "(415) 558-6263"
//   }
//   description:
//     1238 SUTTER STREET - north side between Polk Street and Van Ness Avenue;
//     Lot 011 in Assessor’s block 0670 - Request for Conditional Use
//     Authorization...
//   preliminaryRecommendation:
//     Approve with Conditions
//   action:
//     Approve with Conditions as amended by staff, incorporating the desing
//     comments from Commissioners; with a minimum 13’ setback on Sutter Street
module.exports = new mongoose.Schema({
	address: String
	, city: String
	, neighborhood: String
	, description: String
	, benefits: String
	, zoning: String
	, units: Number
	, status: String
	, supervisor: String
	, statusCategory: String
	, picture: String
	, coordinates: Array
	, featured: Boolean
	, sponsorFirm: String
	, hearings: [projectHearingSchema]
})

