import { Link } from 'react-router-dom';

import { getFormatedDate } from '../utils/getFormatedDate.ts';
import type { Job } from '../constants/data.ts';

const JobList = ({ jobs }: { jobs: Job[] }): React.ReactElement => {
  return (
    <ul className="box">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </ul>
  );
};

const JobItem = ({ job }: { job: Job }): React.ReactElement => {
  const title = job.company
    ? `${job.title} at ${job.company.name}`
    : job.title;
  return (
    <li className="media">
      <div className="media-left has-text-grey">
        {getFormatedDate(job.date)}
      </div>
      <div className="media-content">
        <Link to={`/jobs/${job.id}`}>
          {title}
        </Link>
      </div>
    </li>
  );
};

export default JobList;
