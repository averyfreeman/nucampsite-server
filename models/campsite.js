const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: true,
		},
		text: {
			type: String,
			require: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
);

const campsiteSchema = new Schema(
	{
		// document properties
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		elevation: {
			type: Number,
			required: true,
			min: 0,
		},
		featured: {
			type: Boolean,
			required: false,
		},
		// subschema
		comments: [commentSchema],
	},
	// global properties
	{
		timestamps: true,
	},
);

const Campsite = mongoose.model('Campsite', campsiteSchema);

module.exports = Campsite;
