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
                        filter: { phonenumber: doc.internal.enqno },
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
            console.log(args.record);
            let clientfilter = args.record.filter;
            const students = await Student.find(clientfilter)
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
                filter: clientfilter,
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
