import { authMiddleware } from '../middleware/authMiddleware';
import { StudentTC } from '../models/student';
import {
    addStudents,
    getStudents,
} from '../resolvers/lead';

StudentTC.addResolver(addStudents);
StudentTC.addResolver(getStudents);

StudentTC.getResolver('findMany').addFilterArg({
    name: 'bycalls',
    type: 'MongoID',
    description: 'Search by call',
    query: (rawQuery, value) => {
        rawQuery.calls = { $eleMatch: { _id: value } };
    },
});
const LeadQuery = {
    leadById: StudentTC.getResolver('findById'),
    leadByIds: StudentTC.getResolver('findByIds'),
    getStudents: StudentTC.getResolver('getStudents'),
    leadOne: StudentTC.getResolver('findOne'),
    leadMany: StudentTC.getResolver('findMany'),
    leadCount: StudentTC.getResolver('count'),
    leadConnection: StudentTC.getResolver('connection'),
    leadPagination: StudentTC.getResolver('pagination'),
};

const LeadMutation = {
    addStudents: StudentTC.getResolver('addStudents'),
    leadCreateOne: StudentTC.getResolver('createOne'),
    leadCreateMany: StudentTC.getResolver('createMany'),
    leadUpdateById: StudentTC.getResolver('updateById'),
    leadUpdateOne: StudentTC.getResolver('updateOne'),
    leadUpdateMany: StudentTC.getResolver('updateMany'),
    leadRemoveById: StudentTC.getResolver('removeById'),
    leadRemoveOne: StudentTC.getResolver('removeOne'), // Cann
    leadRemoveMany: StudentTC.getResolver('removeMany'),
};

export { LeadQuery, LeadMutation };
