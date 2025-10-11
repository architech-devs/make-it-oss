import mongoose from 'mongoose';

const showcaseSubmissionSchema = new mongoose.Schema(
    {
        repoUrl: {
            type: String,
            required: [true, 'Repository URL is required'],
            unique: true,
            trim: true,
        },
        owner: {
            type: String,
            required: [true, 'Repository owner is required'],
            trim: true,
        },
        repoName: {
            type: String,
            required: [true, 'Repository name is required'],
            trim: true,
        },
        submitterEmail: {
            type: String,
            required: [true, 'Submitter email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            trim: true,
        },
        submissionDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: {
                values: ['pending', 'approved', 'rejected'],
            },
            default: 'pending',
        },
        weekNumber: {
            type: Number,
            min: 1,
        },
        adminNotes: {
            type: String,
            trim: true,
        },
        metadata: {
            type: object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes for faster queries
showcaseSubmissionSchema.index({ status: 1, submissionDate: -1 });
showcaseSubmissionSchema.index({ weekNumber: 1 });
showcaseSubmissionSchema.index({ owner: 1, repoName: 1 });

const ShowcaseSubmission = mongoose.model('ShowcaseSubmission', showcaseSubmissionSchema);

export default ShowcaseSubmission;