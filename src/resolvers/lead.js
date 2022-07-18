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
                page: 1,
                limit: 2,
            };
            let clientfilter = args.record.filter
            const filter = {
                stream: args.record.filter.stream,
                branch: args.record.filter.branch,
                
            }
            if('markscard10th' in clientfilter.docs){
                if(clientfilter.docs.markscard10th === 'Not Submitted'){
                    filter.$and.push({
                        'docs.docname.10th': {
                            $ne: 'Submitted'
                        }
                    })
                }
                if(args.record.filter.docs.markscard10th === 'Submitted'){
                    filter.$and.push({
                        'docs.docname.10th': {
                            $eq: 'Submitted'
                        }
                    })
                }
            }
            
            if(args.record.filter.docs.markscard12th === 'Not Submitted'){
                filter.$and.push({
                    'docs.docname.12th': {
                        $ne: 'Submitted'
                    }
                })
            }
            if(args.record.filter.docs.markscard12th === 'Submitted'){
                filter.$and.push({
                    'docs.docname.12th': {
                        $eq: 'Submitted'
                    }
                })
            }
            if(args.record.filter.docs.tc === 'Not Submitted'){
                filter.$and.push({
                    'docs.docname.TC': {
                        $ne: 'Submitted'
                    }
                })
            }
            if(args.record.filter.docs.tc === 'Submitted'){
                filter.$and.push({
                    'docs.docname.TC': {
                        $eq: 'Submitted'
                    }
                })
            }
            if(args.record.filter.docs.mig === 'Submitted'){
                filter.$and.push({
                    'docs.docname.MIG': {
                        $eq: 'Submitted'
                    }
                })
            }
            if(args.record.filter.docs.mig === 'Not Submitted'){
                filter.$and.push({
                    'docs.docname.MIG': {
                        $ne: 'Submitted'
                    }
                })
            }
            Object.keys(filter).forEach(key => {
                if (filter[key] === undefined) {
                  delete filter[key];
                }
              });
            
            console.log(filter)


            const students = await Student.find(filter)
                .limit(options.limit * 1)
                .skip((options.page - 1) * options.limit)

                .exec();
            const total = await Student.countDocuments();
            console.log(students);
            return {
                students,
                total: Math.ceil(total / options.limit),
                currentPage: options.page,
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
