import { UserTC } from '../models/user';
import { StudentTC} from '../models/student';

StudentTC.addRelation('createdByUser', {
  resolver: () => UserTC.getResolver('findOne'),
  prepareArgs: {
    _id: source => source.userID
  },
  projection: { createdByUser: 1 }
})
