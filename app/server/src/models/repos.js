    import mongoose from 'mongoose';

    const repoSchema = new mongoose.Schema(
        {
            repoUrl: {
                type: String,
                required: [true, 'Repository URL is required'],
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
            conversionDate: {
                type: Date,
                default: Date.now,
            },
            filesModified: {
                type: Number,
                default: 0,
                min: 0,
            },
            contributors: {
                type: [String],
                default: [],
            },
            stars: {
                type: Number,
                default: 0,
                min: 0,
            },
            language: {
                type: String,
                trim: true,
            },
            metadata: {
                type: mongoose.Schema.Types.Mixed,
                default: {},
            },
            geminiAnalysis: {
                type: mongoose.Schema.Types.Mixed,
                default: {},
            },
            status: {
                type: String,
                enum: {
                    values: ['completed', 'failed'],
                    message: '{VALUE} is not a valid status',
                },
                default: 'completed',
            },
        },
        {
            timestamps: true,
        }
    );

    // Add indexes for faster queries
    repoSchema.index({ repoUrl: 1 });
    repoSchema.index({ owner: 1, repoName: 1 });
    repoSchema.index({ conversionDate: -1 });
    repoSchema.index({ status: 1 });

    const Repo = mongoose.model('Repo', repoSchema);

    export default Repo;