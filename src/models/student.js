import mongoose, { Schema } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import paginate from 'mongoose-paginate-v2';

export const StudentSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        stream: {
            type: String,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            trim: true,
        },
        dob: {
            type: String,
            trim: true,
        },
        religion: {
            type: String,
            trim: true,
        },
        nationality: {
            type: String,
            trim: true,
        },
        mothertongue: {
            type: String,
            trim: true,
        },
        caste: {
            type: String,
            trim: true,
        },
        phonenumber: {
            type: String,
            trim: true,
        },
        emailid: {
            type: String,
            trim: true,
        },
        remark: {
            type: String,
        },
        notes:{
            type: String,
        },
        internal: {
            bsno: {
                type: String,
            },
            enqno: {
                type: String,
            },
            dateofadmission: {
                type: String,
            },
        },
        relations: [
            {
                relationType: {
                    type: String,
                },
                name: {
                    type: String,
                },
                phonenumber: {
                    type: String,
                },
                occupation: {
                    type: String,
                },
                landline: {
                    type: String,
                },
            },
        ],
        address: {
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
            },
            pincode: {
                type: String,
            },
            permanentAddress: {
                type: String,
            },
            communicationAddress: {
                type: String,
            },
        },
        grade: {
            collName12: {
                type: String,
            },
            board12: {
                type: String,
            },
            state12: {
                type: String,
            },
            yearofpassing12: {
                type: String,
            },
            pcmscore: {
                type: mongoose.Schema.Types.Number,
            },
            modeofcal: {
                type: String,
            },
            overallpercentorcgpa: {
                type: String,
            },
            regno: {
                type: String,
            },
            qualipassed: {
                type: String,
            },
            marks: {
                maths: {
                    type: String,
                },
                physics: {
                    type: String,
                },
                chemistry: {
                    type: String,
                },
                electronics: {
                    type: String,
                },
                computer: {
                    type: String,
                },
                bio: {
                    type: String,
                },
                others:{
                    type: String,
                }
            },
        },
        income: {
            type: String,
            trim: true,
        },
        docsdue: {
            type: String,
            trim: true,
        },
        docs: [
            {
                docname: {
                    type: String,
                },
                docothername: {
                    type: String,
                },
            },
        ],
    },
    {
        collection: 'students',
        timestamps: true,
    }
);

StudentSchema.plugin(paginate);
StudentSchema.index({ '$**': 'text' });
StudentSchema.pre('insertMany', function (next) {
    var leads = this;
    leads.forEach((lead) => {
        console.log(lead);
    });
    next();
});
export const Student = mongoose.model('Student', StudentSchema);
export const StudentTC = composeWithMongoose(Student);
