import { Student, StudentTC } from '../models/student';
import { User } from '../models/user';

const addStudents = {
    name: 'addStudents',
    type: 'JSON',
    args: { record: '[JSON]' },

    resolve: async ({ args, context: { user } }) => {
        try {
            let leads = args.record;

            await Student.bulkWrite(
                leads.map((doc) => ({
                    updateOne: {
                        filter: { phonenumber: doc.phonenumber },
                        update: doc,
                        upsert: true,
                    },
                }))
            );
            return {
                message: 'success',
            };
        } catch (error) {
            throw new Error(error);
        }
    },
};

const getStudents = {
    name: 'getStudents',
    type: 'JSON',
    args: { record: 'JSON' },
    resolve: async ({ args, context: { user } }) => {
        try {
            const options = {
                page: args.record.page,
                limit: args.record.limit,
            };
            let clientfilter = args.record.filter;
            const filter = {
                stream: args.record.filter.stream,
                branch: args.record.filter.branch,
                grade: {
                    board12: args.record.filter.board,
                },
                $and: [],
            };
            // if('markscard10th' in clientfilter.docs){
            if (clientfilter.docs.markscard10th === 'Not Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $ne: '10th',
                    },
                });
            }
            if (args.record.filter.docs.markscard10th === 'Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $eq: '10th',
                    },
                });
            }

            if (args.record.filter.docs.markscard12th === 'Not Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $ne: '12th',
                    },
                });
            }
            if (args.record.filter.docs.markscard12th === 'Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $eq: '12th',
                    },
                });
            }
            if (args.record.filter.docs.tc === 'Not Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $ne: 'TC',
                    },
                });
            }
            if (args.record.filter.docs.tc === 'Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $eq: 'TC',
                    },
                });
            }
            if (args.record.filter.docs.mig === 'Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $eq: 'MIG',
                    },
                });
            }
            if (args.record.filter.docs.mig === 'Not Submitted') {
                filter.$and.push({
                    'docs.docname': {
                        $ne: 'MIG',
                    },
                });
            }
            Object.keys(filter).forEach((key) => {
                if (filter[key] === undefined) {
                    delete filter[key];
                }
            });
            if (filter.$and.length === 0) {
                delete filter.$and;
            }

            console.log(filter);

            const students = await Student.find(filter)
                .limit(options.limit * 1)
                .skip((options.page - 1) * options.limit)
                .exec();
            const total = await Student.countDocuments();
            console.log(students);
            return {
                students,
                totalpages: Math.ceil(total / options.limit),
                totalrecords: total,
                currentPage: options.page,
                filter: filter,
            };
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = {
    addStudents,
    getStudents,
};
